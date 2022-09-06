const { S3 } = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const productModel = require("../model/product");

const accessKey = process.env.AWS_ACCESS_KEY_ID;

const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const bucketRegion = process.env.AWS_REGION;

const bucketName = process.env.AWS_BUCKET_NAME;
const s3 = new S3({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});
const uploadS3 = async (files) => {
  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };
  });
  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};
const deleteS3 = async (files) => {
  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3Key,
    };
  });
  return await Promise.all(
    params.map((param) => s3.deleteObject(param).promise())
  );
};

//start page controller.
exports.startPage = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to start page.",
  });
};
//show product details page controller.
exports.viewAllProducts = async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await productModel.find().sort({ createdAt: -2 }).limit(5);
    } else if (qCategory) {
      products = await productModel.find({
        category: {
          $in: [qCategory],
        },
      });
    } else {
      products = await productModel.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

//add new product data controller
exports.addNewProduct = async (req, res, next) => {
  const results = await uploadS3(req.files);
  const {
    productName,
    price,
    description,
    quantity,
    category,
    forMenOrWomen,
    material,
    size,
    status,
  } = req.body;
  let images = [];
  if (results.length > 0) {
    images = results.map((file) => {
      return { imgUrl: file.Location, s3Key: file.key };
    });
  }

  const product = await productModel({
    productName,
    forMenOrWomen,
    category,
    description,
    quantity,
    material,
    size,
    images,
    price,
    status,
  });
  product.save((err, product) => {
    if (!err) {
      res.status(200).json({
        status: "Success",
        result: product,
        message: "Product added.",
      });
    } else {
      res.status(404).json({
        result: err,
        message: "Error while adding product.",
      });
    }
  });
};

//edit product.
exports.editProduct = async (req, res) => {
  const results = await uploadS3(req.files);
  const {
    productId,
    productName,
    price,
    description,
    quantity,
    category,
    forMenOrWomen,
    material,
    size,
    status,
  } = req.body;
  let images = [];
  if (results.length > 0) {
    images = results.map((file) => {
      return { imgUrl: file.Location, s3Key: file.key };
    });
  }
  let s3keys = [];
  const prod = await productModel.findById({ _id: productId });
  if (prod.images.length > 0) {
    s3keys = await prod.images.map((file) => {
      return { s3Key: file.s3Key };
    });
  }
  const deleteresults = await deleteS3(s3keys);
  const update = await productModel
    .findByIdAndUpdate(
      { _id: productId },
      {
        $set: {
          productName,
          forMenOrWomen,
          category,
          description,
          quantity,
          material,
          size,
          images,
          price,
          status,
        },
      }
    )
    .then((result) => {
      res.status(200).json({
        message: "Product Updated",
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

//delete product.

exports.deleteProduct = async (req, res) => {
  try {
    const prod = await productModel.findById({ _id: req.params.id });
    let s3keys = [];
    if (prod.images.length > 0) {
      s3keys = await prod.images.map((file) => {
        return { s3Key: file.s3Key };
      });
    }
    const results = await deleteS3(s3keys);
    const remove = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Product deleted.",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

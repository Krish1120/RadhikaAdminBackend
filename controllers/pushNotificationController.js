const admin = require("firebase-admin");
const userModel = require("../model/user");
const { S3 } = require("aws-sdk");
const dotenv = require("dotenv");
const notificationModel = require("../model/notification");

dotenv.config();

var serviceAccount = require("./radhika-jewellery-cd94b-firebase-adminsdk-1ujbc-7f60a67950.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

// Sending notification to users
exports.sendNotification = async (req, res) => {
  const results = await uploadS3(req.files);
  const { title, body } = req.body;
  let notificationImage = [];
  if (results.length > 0) {
    notificationImage = results.map((file) => {
      return { imgUrl: file.Location, s3Key: file.key };
    });
  }
  const notification = await notificationModel({
    title,
    body,
    notificationImage,
  });
  notification.save();

  const users = await userModel.find();
  let userTokens = [];
  users.map((user) => {
    if (user.fcmToken !== undefined) {
      const itemIndex = userTokens.findIndex(
        (token) => token === user.fcmToken
      );
      if (itemIndex < 0) {
        userTokens.push(user.fcmToken);
      }
    }
  });
  const message = {
    data: {
      title: title,
      body: body,
      imageUrl: notificationImage[0].imgUrl,
    },
    tokens: userTokens,
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then((result) => {
      console.log("Send successfull");
      res.status(200).json({
        message: "Notification Sent Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

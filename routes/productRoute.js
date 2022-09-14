const express = require("express");
const Route = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("File is not of correct type."), false);
  }
};
const upload = multer({ storage: storage, fileFilter });

Route.get("/", productController.startPage);
Route.get("/viewAllProducts", productController.viewAllProducts);
Route.get("/viewAllBanners", productController.viewAllBanners);
Route.post(
  "/addNewProduct",
  upload.array("productPicture"),
  productController.addNewProduct
);
Route.post(
  "/addNewBanner",
  upload.array("productPicture"),
  productController.addNewBanner
);
Route.post(
  "/editProduct",
  upload.array("productPicture"),
  productController.editProduct
);
Route.delete("/deleteProduct/:id", productController.deleteProduct);
Route.delete("/deleteBanner/:id", productController.deleteBanner);
Route.patch("/updateProduct/:id", productController.updateProduct);

module.exports = Route;

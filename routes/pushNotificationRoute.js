const express = require("express");
const Route = express.Router();

const notificationController = require("../controllers/pushNotificationController");
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("File is not of correct type."), false);
  }
};

const upload = multer({ storage: storage, fileFilter });
Route.post(
  "/sendNotification",
  upload.array("productPicture"),
  notificationController.sendNotification
);
module.exports = Route;

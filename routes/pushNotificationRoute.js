const express = require("express");
const Route = express.Router();

const notificationController = require("../controllers/pushNotificationController");

Route.post("/sendNotification", notificationController.sendNotification);
module.exports = Route;

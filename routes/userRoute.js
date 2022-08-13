const express = require("express");
const Route = express.Router();

const userController = require("../controllers/userController");

Route.get("/viewAllUsers", userController.viewAllUsers);
module.exports = Route;
Route.get("/showOrders", userController.showOrders);
module.exports = Route;
Route.patch("/updateOrder/:id", userController.updateOrder);
module.exports = Route;

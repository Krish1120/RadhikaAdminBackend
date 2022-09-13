const express = require("express");
const Route = express.Router();
const couponController = require("../controllers/couponController");

Route.get("/viewAllCoupons", couponController.viewAllCoupons);
Route.post("/addNewCoupon", couponController.addNewCoupon);

// Route.put("/updateCoupon/:id", couponController.updateCoupon);
Route.delete("/deleteCoupon/:id", couponController.deleteCoupon);

module.exports = Route;

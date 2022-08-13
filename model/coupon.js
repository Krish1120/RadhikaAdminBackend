const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = Schema(
  {
    couponName: {
      type: String,
      required: true,
    },
    discountAmount: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rule: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const couponModel = mongoose.model("coupon", couponSchema);
module.exports = couponModel;

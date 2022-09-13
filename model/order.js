const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    products: [
      {
        productID: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    shipRocketOrderId: {
      type: String,
      required: true,
    },
    shipRocketShipmentId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;

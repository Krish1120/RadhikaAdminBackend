const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    forMenOrWomen: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    material: {
      type: Array,
      required: true,
    },
    size: {
      type: Array,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    status: {
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

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;

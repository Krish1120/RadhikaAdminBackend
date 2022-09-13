const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = Schema(
  {
    bannerImage: {
      type: Array,
      required: true,
    },
    screen: {
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

const bannerModel = mongoose.model("banner", bannerSchema);
module.exports = bannerModel;

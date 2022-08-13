const couponModel = require("../model/coupon");

//show product details page controller.
exports.viewAllCoupons = async (req, res) => {
  try {
    let coupons;
    coupons = await couponModel.find();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json(err);
  }
};

//add new coupon data controller.
exports.addNewCoupon = async (req, res, next) => {
  console.log(req.body);
  const { discountAmount, description, rule } = req.body;
  let couponName = req.body.couponName.toUpperCase();
  const coupon = await couponModel({
    couponName,
    discountAmount,
    description,
    rule,
  });
  coupon.save((err, coupon) => {
    if (!err) {
      res.status(200).json({
        status: "Success",
        result: coupon,
        message: "Coupon added.",
      });
    } else {
      res.status(404).json({
        result: err,
        message: "Error while adding coupon.",
      });
    }
  });
};

//update product.
// exports.updateCoupon = async (req, res) => {
//   try {
//     const update = await couponModel.findByIdAndUpdate(req.params.id, {
//       $set: req.body,
//     });
//     res.status(200).json({
//       message: "Coupon updated.",
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

//delete product.
exports.deleteCoupon = async (req, res) => {
  try {
    const remove = await couponModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Coupon deleted.",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

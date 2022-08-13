const userModel = require("../model/user");
const orderModel = require("../model/order");

// show products
exports.viewAllUsers = async (req, res) => {
  try {
    let users;
    users = await userModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};
// update order.
exports.updateOrder = async (req, res) => {
  try {
    const update = await orderModel.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res.status(200).json({
      message: "Order Status updated.",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
//show orders
exports.showOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

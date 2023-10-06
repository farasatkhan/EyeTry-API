var OrderModel = require('../../../models/Order.js');



exports.checkout = async (req, res, next) => {
  console.log("Backend checkout function called");
  try {
    // Extract the entire order object from the request body
    const orderData = req.body;

    console.log("Checkout Received Data:", orderData);

    const order = await OrderModel.create(orderData);

    if (!order) {
      return res.status(400).json({
        message: "400: Error occurred while placing order",
      });
    }

    res.status(200).json({
      orderId: order._id,
      message: "Order Placed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "500: Error occurred when checkout." });
  }
};





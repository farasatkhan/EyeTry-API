var OrderModel = require('../../../models/Order.js');



exports.checkout = async (req, res, next) => {

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



// Define the route to view all orders placed by a user
exports.viewAllOrders = async (req, res, next) => {
  
  const userId = req.params.userId;

  try {
    // Find all orders associated with the user
    const orders = await OrderModel.find({ user: userId });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500: Error occurred while fetching orders." });
  }
};






const GiftCardModel = require("../../../models/Giftcard.js");
var OrderModel = require("../../../models/Order.js");

exports.checkout = async (req, res, next) => {
  try {
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

exports.updateOrderDeliveryStatus = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const { deliveryStatus } = req.body;

    console.log(deliveryStatus);

    const updatedOrderInfo = await OrderModel.findByIdAndUpdate(
      orderId,
      { deliveryStatus: deliveryStatus },
      { new: true }
    );

    if (!updatedOrderInfo)
      return res
        .status(400)
        .json({ message: "400: Error occured while updating order." });

    res.status(200).json({
      products: updatedOrderInfo,
      message: "Information is updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "500: Error occured while updating order." });
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
    res
      .status(500)
      .json({ message: "500: Error occurred while fetching orders." });
  }
};

// getting giftcard and updating status

exports.getGiftcard = async (req, res, next) => {
  const coupen = req.params.coupen;

  try {
    // Find the gift card associated with the provided code
    const giftcard = await GiftCardModel.findOne({ code: coupen });

    if (!giftcard) {
      return res.status(404).json({ message: "Gift card not found." });
    }

    // Check if the status is already "Expired"
    if (giftcard.status === "Expired") {
      return res.status(200).json({ message: "Gift card has already expired." });
    }

    // If not expired, update the status to "Expired"
    await GiftCardModel.findOneAndUpdate({ code: coupen }, { $set: { status: "Expired" } });

    // Return the gift card details
    res.status(200).json({ giftcard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500: Error occurred while fetching gift cards." });
  }
};


exports.orderAnalytics = async (req, res, next) => {
  try {
    const allOrders = await OrderModel.find();

    if (!allOrders)
      return res
        .status(400)
        .json({ message: "400: Error occured while getting orders." });

    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(
      (order) => order.deliveryStatus === "Pending"
    ).length;
    const deliveredOrders = allOrders.filter(
      (order) => order.deliveryStatus === "Delivered"
    ).length;
    const totalRevenue = allOrders
      .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0)
      .toFixed(2);
    const totalTransactions = allOrders.length;
    const readyOrders = allOrders.filter(
      (order) => order.deliveryStatus === "Pending"
    ).length;

    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const salesByDay = {};

    for (let i = thirtyDaysAgo; i <= currentDate; i.setDate(i.getDate() + 1)) {
      const day = String(i.getDate()).padStart(2, '0');
      const month = String(i.getMonth() + 1).padStart(2, '0');
      const year = i.getFullYear();
      const fullDate = `${year}-${month}-${day}`;

      salesByDay[fullDate] = 0;
    }

    allOrders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const day = String(orderDate.getDate()).padStart(2, '0');
      const month = String(orderDate.getMonth() + 1).padStart(2, '0');
      const year = orderDate.getFullYear();
      const fullDate = `${year}-${month}-${day}`;

      const totalPrice = parseFloat(order.totalPrice);
      salesByDay[fullDate] += totalPrice;
    });

    const salesChart = Object.entries(salesByDay)
    .filter(([date]) => !isNaN(new Date(date)))
    .map(([date, amount]) => ({
      date,
      amount
    }));

    const getTotalSalesByMonth = () => {
      const monthlySales = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
        value: 0,
      }));
    
      allOrders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const month = orderDate.getMonth();
        const totalPrice = parseFloat(order.totalPrice);
    
        monthlySales[month].value += totalPrice;
      });
    
      return monthlySales;
    };
    
    const revenueChart = getTotalSalesByMonth();

    const getOrdersByMonth = () => {
      const monthlyOrders = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
        value: 0,
      }));
    
      allOrders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const month = orderDate.getMonth();
    
        monthlyOrders[month].value++;
      });
    
      return monthlyOrders;
    };
    
    const totalOrderChart = getOrdersByMonth();

    const getDeliveredOrdersByMonth = () => {
      const deliveredOrdersByMonth = {};
    
      allOrders.forEach(order => {
        const status = order.deliveryStatus;
        const orderDate = new Date(order.orderDate);
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(orderDate);
        const monthYear = `${monthName}-${orderDate.getFullYear()}`;
    
        if (!deliveredOrdersByMonth[monthYear]) {
          deliveredOrdersByMonth[monthYear] = 0;
        }
    
        if (status === 'Delivered') {
          deliveredOrdersByMonth[monthYear]++;
        }
      });
    
      return deliveredOrdersByMonth;
    };
    
    const deliveredOrdersByMonth = getDeliveredOrdersByMonth();
    
    // Generate an array with all months in a year
    const deliveredMonthsOfYear = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(Date.UTC(new Date().getFullYear(), i, 1));
      return {
        name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
        value: 0,
      };
    });
    
    // Merge the counts with the array of all months
    const deliveredOrdersChart = deliveredMonthsOfYear.map(month => ({
      ...month,
      value: deliveredOrdersByMonth[`${month.name}-${new Date().getFullYear()}`] || 0,
    }));

    const getPendingOrdersByMonth = () => {
      const pendingOrdersByMonth = {};
    
      allOrders.forEach(order => {
        const status = order.deliveryStatus;
        const orderDate = new Date(order.orderDate);
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(orderDate);
        const monthYear = `${monthName}-${orderDate.getFullYear()}`;
    
        if (!pendingOrdersByMonth[monthYear]) {
          pendingOrdersByMonth[monthYear] = 0;
        }
    
        if (status === 'Pending') {
          pendingOrdersByMonth[monthYear]++;
        }
      });
    
      return pendingOrdersByMonth;
    };
    
    const pendingOrdersByMonth = getPendingOrdersByMonth();
    
    // Generate an array with all months in a year
    const pendingMonthsOfYear = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(Date.UTC(new Date().getFullYear(), i, 1));
      return {
        name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
        value: 0,
      };
    });
    
    // Merge the counts with the array of all months
    const pendingOrdersChart = pendingMonthsOfYear.map(month => ({
      ...month,
      value: pendingOrdersByMonth[`${month.name}-${new Date().getFullYear()}`] || 0,
    }));

    res.status(200).json({
      salesChart: salesChart,
      revenueChart: revenueChart,
      totalOrderChart: totalOrderChart,
      pendingOrdersChart: pendingOrdersChart,
      deliveredOrdersChart: deliveredOrdersChart,
      totalOrders: totalOrders,
      pendingOrders: pendingOrders,
      deliveredOrders: deliveredOrders,
      totalRevenue: totalRevenue,
      totalTransactions: totalTransactions,
      readyOrders: readyOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

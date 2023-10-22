var express = require('express');
var router = express.Router();

var { authenticateToken } = require('../controllers/Auth/AuthController');
var OrderController = require('../controllers/Products/v1/OrdersController');

router.post('/checkout', OrderController.checkout);
router.get('/viewAllOrders/:userId', OrderController.viewAllOrders);

router.put('/:orderId', OrderController.updateOrderDeliveryStatus);

router.get('/analytics', OrderController.orderAnalytics)

module.exports = router;
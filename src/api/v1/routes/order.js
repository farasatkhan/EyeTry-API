var express = require('express');
var router = express.Router();

var { authenticateToken } = require('../controllers/Auth/AuthController');
var OrderController = require('../controllers/Products/v1/OrdersController');

router.post('/checkout', authenticateToken, OrderController.checkout);
router.get('/viewAllOrders/:userId', authenticateToken, OrderController.viewAllOrders);

router.put('/:orderId', OrderController.updateOrderDeliveryStatus);

module.exports = router;
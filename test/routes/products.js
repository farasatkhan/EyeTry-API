var express = require('express');
var router = express.Router();

var ProductController = require('../controller/ProductController');

router.post('/add_product', ProductController.addProduct);

router.get('/view_product', ProductController.viewProducts);

module.exports = router;
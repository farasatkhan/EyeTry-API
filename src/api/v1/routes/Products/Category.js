var express = require('express');
var router = express.Router();

var CategoryController = require('../../controllers/Products/v1/CategoryController');

router.post('/', CategoryController.addCategory);
router.get('/', CategoryController.viewCategory);
router.put('/:categoryId', CategoryController.updateCategory);
router.delete('/:categoryId', CategoryController.deleteCategory);

module.exports = router;
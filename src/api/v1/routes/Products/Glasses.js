var express = require('express');
var router = express.Router();

var GlassesController = require('../../controllers/Products/v1/GlassesController');

router.post('products/glasses', GlassesController.addGlasses);
router.get('products/glasses', GlassesController.viewGlasses);
router.put('products/glasses/:glassesId', GlassesController.updateGlasses);
router.delete('products/glasses/:glassesId', GlassesController.deleteGlasses);

module.exports = router;
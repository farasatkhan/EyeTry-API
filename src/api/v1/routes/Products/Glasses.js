var express = require('express');
var router = express.Router();

var GlassesController = require('../../controllers/Products/v1/GlassesController');

var { uploadProductImagesServer } = require('../../helpers/ImageStorage');

router.post('/', GlassesController.addGlasses);
router.get('/', GlassesController.viewGlasses);
router.put('/:glassesId', GlassesController.updateGlasses);
router.delete('/:glassesId', GlassesController.deleteGlasses);

router.put('/:glassesId/images', uploadProductImagesServer.array('product_images', 5), GlassesController.addProductImages);
router.get('/:glassesId/images' , GlassesController.viewProductImages);
router.delete('/:glassesId/images/:imageId', GlassesController.deleteProductImages);

module.exports = router;
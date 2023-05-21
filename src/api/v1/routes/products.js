var express = require('express');
var router = express.Router();

var ProductController = require('../controllers/Products/ProductsController');
var ProductUtilityController = require('../controllers/Products/ProductUtilityController');

var { authenticateToken } = require('../controllers/Auth/AdminAuthController');
var { uploadProductImagesServer } = require('../helpers/ImageStorage');

router.post('/frame', authenticateToken, ProductController.addFrame);
router.put('/frame/:frameId', authenticateToken, ProductController.updateFrame);
router.delete('/frame/:frameId', authenticateToken, ProductController.deleteFrame);

router.put(
    '/frame/images/:frameId', 
    authenticateToken,
    ProductUtilityController.frameIdExists, 
    uploadProductImagesServer.fields([
        {name: 'image_1', maxCount: 1}, {name: 'image_2', maxCount: 1}, {name: 'image_3', maxCount: 1}, 
        {name: 'image_4', maxCount: 1}, {name: 'image_5', maxCount: 1}
    ]), 
    ProductController.uploadFrameProductImages);

router.delete(
    '/frame/images/:frameId/:imageId', 
    authenticateToken, 
    ProductUtilityController.frameIdExists,
    ProductController.deleteFrameProductImage
    );

router.get('/frame', ProductController.viewAllFrames);
router.get('/frame/:frameId', ProductController.viewParticularFrame);

module.exports = router;
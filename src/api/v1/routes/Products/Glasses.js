var express = require('express');
var router = express.Router();

var GlassesController = require('../../controllers/Products/v1/GlassesController');

router.post('/', GlassesController.addGlasses);
router.get('/', GlassesController.viewGlasses);
router.put('/:glassesId', GlassesController.updateGlasses);
router.delete('//:glassesId', GlassesController.deleteGlasses);

module.exports = router;
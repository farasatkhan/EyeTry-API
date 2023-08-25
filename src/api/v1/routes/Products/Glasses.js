var express = require('express');
var router = express.Router();

var GlassesController = require('../../controllers/Products/v1/GlassesController');

router.post('/glasses', GlassesController.addGlasses);
router.get('/glasses', GlassesController.viewGlasses);
router.put('/glasses/:glassesId', GlassesController.updateGlasses);
router.delete('/glasses/:glassesId', GlassesController.deleteGlasses);

module.exports = router;
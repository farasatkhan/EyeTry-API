var express = require('express');
var router = express.Router();

var AdminController = require('../controllers/Admin/AdminController');

router.post('/add_giftcard', AdminController.addGiftcard);
router.get('/view_giftcard', AdminController.viewGiftcard);
router.put('/update_giftcard/:giftcardId', AdminController.updateGiftcard);
router.delete('/delete_giftcard/:giftcardId', AdminController.deleteGiftcard);

module.exports = router;
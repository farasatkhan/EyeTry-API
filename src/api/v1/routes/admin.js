var express = require('express');
var router = express.Router();

var AdminController = require('../controllers/Admin/AdminController');
var { authenticateToken } = require('../controllers/Auth/AdminAuthController');

router.get('/profile', authenticateToken, AdminController.profile);
router.post('/update_info', authenticateToken, AdminController.updatePersonalInformation);
router.post('/change_password', authenticateToken, AdminController.changePassword);

router.post('/add_giftcard', authenticateToken, AdminController.addGiftcard);
router.get('/view_giftcard', authenticateToken, AdminController.viewGiftcard);
router.put('/update_giftcard/:giftcardId', authenticateToken, AdminController.updateGiftcard);
router.delete('/delete_giftcard/:giftcardId', authenticateToken, AdminController.deleteGiftcard);

module.exports = router;
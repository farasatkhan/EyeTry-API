var express = require('express');
var router = express.Router();

var UsersController = require('../controllers/Users/UsersController');

var { authenticateToken } = require('../controllers/Auth/AuthController');
var { uploadMemStorageS3, uploadProfileImagesServer, uploadTryOnImagesServer } = require('../helpers/ImageStorage');

router.get('/profile', authenticateToken, UsersController.profile);
router.post('/update_info', authenticateToken, UsersController.updatePersonalInformation);
router.post('/delete_account', authenticateToken, UsersController.deleteAccount);
router.post('/change_password', authenticateToken, UsersController.changePassword);
router.post('/forget_password', UsersController.forgetPassword);
router.post('/reset_password', UsersController.resetPassword);

router.post('/add_prescription', authenticateToken, UsersController.addPrescription);
router.get('/view_prescriptions', authenticateToken, UsersController.viewAllPrescriptions);
router.get('/view_prescription/:prescriptionId', authenticateToken, UsersController.viewPrescription);
router.put('/update_prescription/:prescriptionId', authenticateToken, UsersController.updatePrescription);
router.delete('/delete_prescription/:prescriptionId', authenticateToken, UsersController.deletePrescription);

router.post('/add_payment', authenticateToken, UsersController.addPayment);
router.get('/view_payments', authenticateToken, UsersController.viewAllPayments)
router.get('/view_payment/:paymentId', authenticateToken, UsersController.viewPayment);
router.put('/update_payment/:paymentId', authenticateToken, UsersController.updatePayment);
router.delete('/delete_payment/:paymentId', authenticateToken, UsersController.deletePayment);

router.post('/add_address', authenticateToken, UsersController.addAddress);
router.get('/view_address/:addressId', authenticateToken, UsersController.viewAddress);
router.get('/view_addresses', authenticateToken, UsersController.viewAllAddresses);
router.put('/update_address/:addressId', authenticateToken, UsersController.updateAddress);
router.delete('/delete_address/:addressId', authenticateToken, UsersController.deleteAddress);

router.post('/add_favorite', authenticateToken, UsersController.addWishlist);
router.get('/view_favorite', authenticateToken, UsersController.viewWishlist);
router.delete('/delete_favorite/:productId', authenticateToken, UsersController.removeWishlist);

router.post('/redeem_giftcard', authenticateToken, UsersController.redeemGiftcard);

router.post('/upload_image_s3', authenticateToken, uploadMemStorageS3.single('image'), UsersController.uploadProfileImageS3);
router.get('/view_image_s3', authenticateToken, UsersController.viewProfileImageS3);
router.delete('/remove_image_s3', authenticateToken, UsersController.deleteProfileImageS3);

router.post('/upload_tryon_image_s3', authenticateToken, uploadMemStorageS3.single('image'), UsersController.uploadTryOnImageS3);
router.get('/view_tryon_images_s3', authenticateToken, UsersController.viewTryOnImagesS3);
router.delete('/remove_tryon_image_s3/:tryOnImageId', authenticateToken, UsersController.deleteTryOnImageS3);

router.post('/upload_image_server', authenticateToken, uploadProfileImagesServer.single('image'), UsersController.uploadProfileImageServer);
router.get('/view_image_server', authenticateToken, UsersController.viewProfileImageServer);
router.delete('/remove_image_server', authenticateToken, UsersController.deleteProfileImageServer);

router.post('/upload_tryon_image_server', authenticateToken, uploadTryOnImagesServer.single('image'), UsersController.uploadTryOnImageServer);
router.get('/view_tryon_images_server', authenticateToken, UsersController.viewTryOnImagesServer);
router.delete('/remove_tryon_image_server/:tryOnImageId', authenticateToken, UsersController.deleteTryOnImageServer);

router.post('/submit_vision_assessment_result', authenticateToken, UsersController.submitVisionAssessmentResult);
router.get('/view_vision_assessment_result', authenticateToken, UsersController.viewVisionAssessmentResult);

router.get('/view_image_server/:userId', UsersController.viewProfileImageServerById);

module.exports = router;
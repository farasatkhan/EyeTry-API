var express = require('express');
var router = express.Router();

var UsersController = require('../controllers/Users/UsersController');
var { authenticateToken } = require('../controllers/Auth/AuthController');

router.get('/profile', authenticateToken, UsersController.profile);

router.post('/update_info', authenticateToken, UsersController.updatePersonalInformation);

router.post('/delete_account', authenticateToken, UsersController.deleteAccount);

router.post('/change_password', authenticateToken, UsersController.changePassword);

router.post('/forget_password', UsersController.forgetPassword);

router.post('/reset_password', UsersController.resetPassword);

router.post('/add_prescription', authenticateToken, UsersController.addPrescription);
router.get('/view_prescription/:prescriptionId', authenticateToken, UsersController.viewPrescription);
router.put('/update_prescription/:prescriptionId', authenticateToken, UsersController.updatePrescription);
router.delete('/delete_prescription/:prescriptionId', authenticateToken, UsersController.deletePrescription);

router.post('/add_payment', authenticateToken, UsersController.addPayment);
router.get('/view_payment/:paymentId', authenticateToken, UsersController.viewPayment);
router.put('/update_payment/:paymentId', authenticateToken, UsersController.updatePayment);
router.delete('/delete_payment/:paymentId', authenticateToken, UsersController.deletePayment);

module.exports = router;
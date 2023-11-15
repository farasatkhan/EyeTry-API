var express = require('express');
var router = express.Router();


var SupportAgentController = require('../controllers/SupportAgent/SupportAgentController')
var SupportTicketsController = require('../controllers/SupportAgent/SupportTicketsController')
var { authenticateToken } = require('../controllers/Auth/CustomerSupportAuthController');
var AuthController = require('../controllers/Auth/AuthController')
var { uploadProfileImagesServer } = require('../helpers/ImageStorage');

router.get('/profile', authenticateToken, SupportAgentController.profile);
router.put('/update_profile', authenticateToken, SupportAgentController.updatePersonalInformation);
router.put('/update_password', authenticateToken, SupportAgentController.changePassword);

router.post('/upload_image_server', authenticateToken, uploadProfileImagesServer.single('image'), SupportAgentController.uploadProfileImageServer);
router.get('/view_image_server', authenticateToken, SupportAgentController.viewProfileImageServer);
router.delete('/remove_image_server', authenticateToken, SupportAgentController.deleteProfileImageServer);



module.exports = router; 
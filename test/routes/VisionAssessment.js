var express = require('express');
var router = express.Router();

var { authenticateToken } = require('../../src/api/v1/controllers/Auth/AuthController');

var VisionAssessmentController = require('../controller/VisionAssessment');

router.delete('/delete_vision_assessment_result', authenticateToken, VisionAssessmentController.deleteVisionAssessmentResult);

module.exports = router;
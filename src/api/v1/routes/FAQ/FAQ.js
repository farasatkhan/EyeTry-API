var express = require('express');
var router = express.Router();

var FAQController = require('../../controllers/Admin/FAQController');

router.post('/', FAQController.addFAQ);
router.get('/', FAQController.viewFAQ);
router.put('/:faqId', FAQController.updateFAQ);
router.delete('/:faqId', FAQController.deleteFAQ);

module.exports = router;
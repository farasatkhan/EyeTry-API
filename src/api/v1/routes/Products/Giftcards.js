var express = require('express');
var router = express.Router();

var GiftcardsController = require('../../controllers/Products/v1/GiftcardsController');

router.post('/', GiftcardsController.addGiftcard);
router.get('/', GiftcardsController.viewGiftcards);
router.put('/:giftcardId', GiftcardsController.updateGiftcards);
router.delete('/:giftcardId', GiftcardsController.deleteGiftcards);

module.exports = router;
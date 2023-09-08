var express = require('express');
var router = express.Router();

var ReviewsController = require('../../controllers/Products/v1/ReviewsController');

router.get('/', ReviewsController.allReviews);
router.post('/', ReviewsController.addReview);
router.delete('/:reviewId', ReviewsController.deleteReview);

module.exports = router;
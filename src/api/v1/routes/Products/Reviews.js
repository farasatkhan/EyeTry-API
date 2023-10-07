var express = require('express');
var router = express.Router();

var ReviewsController = require('../../controllers/Products/v1/ReviewsController');

router.get('/', ReviewsController.allReviews);
router.post('/', ReviewsController.testAddReview);
router.delete('/:reviewId', ReviewsController.deleteReview);

// user side review routes
router.post('/addReview', ReviewsController.userAddReview)
router.get('/viewAllReviews', ReviewsController.viewAllReviews)

module.exports = router;
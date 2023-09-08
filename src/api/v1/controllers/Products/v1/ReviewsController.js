var ReviewModel = require('../../../models/Products/Review.js');
var OrderModel = require('../../../models/Order.js');


/* This add review is for testing purpose for admin dashboard. don't use it */
exports.testAddReview = async (req, res, next) => {
    try {
        const Review = await ReviewModel.create({
            user: "6469e31e8685cffac02f9ae2",
            order: "64f611f71c1347a4c904df07",
            user_review_title: "User Review Title",
            user_review_description: "User Review description",
            stars: 4
        });

        res.status(200).json(
            {
                ReviewId: Review._id,
                message: "Review is added successfully."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured when adding reviews."})
    }
}

exports.allReviews = async (req, res, next) => {
    try {
        const Reviews = await ReviewModel.find({})
        .populate({path: 'order', select: 'order_no'})
        .populate({path: 'user', select: 'firstName lastName email'});

        res.status(200).json(Reviews);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured when fetching reviews."})
    }
}

exports.deleteReview = async (req, res, next) => {
    const reviewId = req.params.reviewId;
    console.log(reviewId);
    try {
        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);
    
        if (!deletedReview) {
          return res.status(404).json({ message: 'Review not found' });
        }
    
        res.status(200).json({ message: 'Review deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the Review' });
      }
}
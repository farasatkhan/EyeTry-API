var ReviewModel = require('../../../models/Products/Review.js');

exports.allReviews = async (req, res, next) => {
    res.status(200).json({message: "Success"});
}
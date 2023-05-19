const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    detailedDescription: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: true
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    frameMaterial: {
        type: [String],
        required: true
    },
    frameStyle: {
        type: String,
        required: true
    },
    frameColor: {
        type: [String],
        required: true
    },
    frameSize: {
        type: [String],
        required: true
    }
});

const Frame = mongoose.model('Frame', frameSchema);

module.exports = Frame;

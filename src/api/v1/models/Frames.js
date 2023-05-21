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
    brand: {
        type: String,
    },
    type: {
        type: String,
    },
    category: [{
        type: String,
        required: true
    }],
    subcategory: [{
        type: String,
    }],
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
    }],
    frameMaterial: [{
        type: String,
    }],
    frameStyle: [{
        type: String,
    }],
    frameColor: [{
        type: String,
    }],
    frameSize: [{
        type: String,
    }],
    images: [{
        type: String,
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
});

const Frame = mongoose.model('Frame', frameSchema);

module.exports = Frame;

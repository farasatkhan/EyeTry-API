const mongoose = require('mongoose');

const lensSchema = new mongoose.Schema({
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
    category: {
        type: [String],
        required: true
    },
    subcategory: {
        type: [String],
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
    lensType: {
        type: String,
        required: true
    },
    lensCoating: {
        type: [String],
        required: true
    }
});

const Lens = mongoose.model('Lens', lensSchema);

module.exports = Lens;

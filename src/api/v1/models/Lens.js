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
    brand: {
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
    lensType: [{
        type: String,
    }],
    lensCoating: [{
        type: String,
    }],
    images: [{
        type: String,
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

const Lens = mongoose.model('Lens', lensSchema);

module.exports = Lens;

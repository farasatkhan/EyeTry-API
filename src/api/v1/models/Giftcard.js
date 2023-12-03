const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Expired'],
        default: 'Active'
    },
    note: {
        type: String
    },
    expirationDate: {
        type: Date
    }
});

const GiftCardModel = mongoose.model('GiftCard', giftCardSchema);

module.exports = GiftCardModel;
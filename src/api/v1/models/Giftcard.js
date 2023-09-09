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
        enum: ['active', 'expired'],
        default: 'active'
    },
    note: {
        type: String
    },
    expirationDate: {
        type: Date
    }
});

module.exports = mongoose.model('GiftCard', giftCardSchema);
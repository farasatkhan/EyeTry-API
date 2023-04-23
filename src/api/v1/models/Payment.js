var mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentType: {
        type: String,
        required: true,
        enum: ['Stripe', 'PayPal', 'Credit Card'],
    },
    nameOnCard: {
        type: String,
        required: function() {
            return this.paymentType === 'Credit Card';
        },
    },
    cardNumber: {
        type: String,
        required: function() {
            return this.paymentType === 'Credit Card';
        },
    },
    expirationMonth: {
        type: Date,
        required: function() {
            return this.paymentType === 'Credit Card';
        },
    },
    expirationYear: {
        type: Date,
        required: function() {
            return this.paymentType === 'Credit Card';
        },
    },
    cvv: {
        type: String,
        required: function() {
            return this.paymentType === 'Credit Card';
        },
    },
    billingInfo: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
    },
});

module.exports = mongoose.model("Payment", paymentSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    tryOnImages: [{
        type: String
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    }],
    status: {
        user_status: {
            type: String,
            default: "Active"
        },
        is_banned: {
            banned_until: {
                type: String,
            },
            banned_reason: {
                type: String
            }
        }
    },
    visionAssessments: [{
        testType: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            required: true
        },
        testDate: {
            type: Date,
            required: true,
            default: new Date(),
        }
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    addressBook: [{
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        phone: {
            type: String
        },
        currentAddress: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        zipCode: {
            type: String
        },
    }],
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
    }
});

module.exports = mongoose.model('User', userSchema);
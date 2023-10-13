const mongoose = require('mongoose');

const customerSupportSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    role: {
        type: String,
        default: "customer_support"
    },
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    chatHistory: [{
        customerName: String,
        message: String,
        createdAt: Date
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
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
    }
}); 

module.exports = mongoose.model('CustomerSupport', customerSupportSchema);
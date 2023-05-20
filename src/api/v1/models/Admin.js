const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
        default: "admin"
    },
    access: {
        type: Object,
        analytics: {
            type: Boolean,
            default: true,
        },
        addGlasses: {
            type: Boolean,
            default: true,
        },
        addFrames: {
            type: Boolean,
            default: true,
        },
        addLens: {
            type: Boolean,
            default: true,
        },
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
    }
});

module.exports = mongoose.model('Admin', adminSchema);
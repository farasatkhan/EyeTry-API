const mongoose = require('mongoose');

const prescriptionInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prescriptionName: {
        type: String,
        required: true
    },
    prescriptionType: {
        type: String,
        required: true
    },
    birthYear: {
        type: Number,
        required: true
    },
    dateOfPrescription: {
        type: Date,
        required: true
    },
    renewalReminderDate: {
        type: Date,
        required: true
    },
    singleOrDualPD: {
        type: String,
        required: true
    },
    pdInformation: {
        left: {
            leftPD: {
                type: Number,
                required: true
            },
            sphere: {
                type: Number,
                required: true
            },
            cylinder: {
                type: Number,
                required: true
            },
            axis: {
                type: Number,
                required: true
            }
        },
        right: {
            rightPD: {
                type: Number,
                required: true
            },
            sphere: {
                type: Number,
                required: true
            },
            cylinder: {
                type: Number,
                required: true
            },
            axis: {
                type: Number,
                required: true
            }
        },
        nvadd: {
            type: Number
        }
    },
    prismProperties: {
        left: {
            prismHorizontal: {
                type: Number,
                required: true
            },
            prismVertical: {
                type: Number,
                required: true
            },
            baseDirectionHorizontal: {
                type: String,
                required: true
            },
            baseDirectionVertical: {
                type: String,
                required: true
            },
        },
        right: {
            prismHorizontal: {
                type: Number,
                required: true
            },
            prismVertical: {
                type: Number,
                required: true
            },
            baseDirectionHorizontal: {
                type: String,
                required: true
            },
            baseDirectionVertical: {
                type: String,
                required: true
            },
        },
    },
});

module.exports = mongoose.model('Prescription', prescriptionInfoSchema);
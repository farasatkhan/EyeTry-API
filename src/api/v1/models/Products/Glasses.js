const mongoose = require('mongoose');

const glasses = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    meta: {
        title: {
            type: String,
            required: true
        },
        keyword: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    },
    manufacturer: {
        type: String,
        required: true
    },
    frame_information: {
        framematerial: [{
            type: String,
            required: true
        }],
        frame_size: [{
            type: String,
            required: true
        }],
        colors: [{
            color: {
                type: String,
                required: true
            },
            images: {
                small: [{
                    type: String,
                    required: true
                }],
                medium: [{
                    type: String,
                    required: true
                }],
                large: [{
                    type: String,
                    required: true
                }],
            },
        }],
    },
    lens_information: {
        lenswidth: {
            type: Number,
            required: true
        },
        lensheight: {
            type: Number,
            required: true
        },
        totalwidth: {
            type: Number,
            required: true
        },
        bridgewidth: {
            type: Number,
            required: true
        },
        templelength: {
            type: Number,
            required: true
        },
        is_multifocal: {
            type: Boolean,
            required: true
        },
    },
    person_information: {
        face_shape: [{
            type: String,
            required: true
        }],
        gender: [{
            type: String,
            required: true
        }],
    },
    insurance: {
        single_vision: {
            type: Number,
            required: true
        },
        reading: {
            type: Number,
            required: true
        },
        progressive: {
            type: Number,
            required: true
        },
        bifocal: {
            type: Number,
            required: true
        },
        frame: {
            type: Number,
            required: true
        },
        no_prescription: {
            type: Number,
            required: true
        },
        transition: {
            type: Number,
            required: true
        },
    },
    stock: {
        is_low_stock: {
            type: Boolean,
            required: true
        },
        is_out_of_stock: {
            type: Boolean,
            required: true
        },
        is_in_stock: {
            type: Boolean,
            required: true
        },
        available_qty: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    },
    reviews: {
        total_reviews: {
            type: Number,
            required: true
        },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reviews'
        }],
    },
    categories: [{
        type: String,
        required: true
    }],
    coupons: [{
        code: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }, ],
});

module.exports = mongoose.model('glasses', glasses);
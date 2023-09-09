const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    order_no: {
        type: String,       // IDK about it, Farasat added it before
        required: true
    },
    customer: {           // user buying the product, refferencing to User schema
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    frame: {              // selected frame, refferencing to Frames schema
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Frames',
        required: true,
    },
    prescription: {       // refferencing to prescription schema
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true
    },
    prescriptionType: {   // prescription , non prescription, readers
        type: String,
        required: true,
    },
    packageType: {        // Silver, Gold, Platinum, Diamond 
        type: String,
        required: true,
    },
    lensType: {            // clear, blue light, sunglasses , Transition.. etc
        type: [String],
        required: true
    },
    upgrades: {           // includes additional coatings and customizations eg, Super Hydrophobic, color tinit text engraving etc
        type: [String],
    },
    lensCoating: {        // Lenses, Anti-scratch coating, 100% UV-Block coating, Anti-reflective coating etc
        type: [String],
        required: true,
    },
    totalPrice: {         // total order price
        type: Number,
        required: true,
    },
    orderDate: {        // order date
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;

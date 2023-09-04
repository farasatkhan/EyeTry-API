const mongoose = require('mongoose');

// baqi ka schema banana hy khud..
const OrderSchema = new mongoose.Schema({
    order_no : {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
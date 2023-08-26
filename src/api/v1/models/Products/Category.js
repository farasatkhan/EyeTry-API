const mongoose = require('mongoose');

const Categories = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Categories', Categories);
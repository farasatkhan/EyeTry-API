const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 1 }
});

const CounterModel = mongoose.model('Counter', CounterSchema);

module.exports = CounterModel;

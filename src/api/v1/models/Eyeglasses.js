const mongoose = require('mongoose');

const eyeglassesSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  brand: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  frameMaterial: {
    type: [String],
    required: true
  },
  frameStyle: {
    type: String,
    required: true
  },
  frameColor: {
    type: [String],
    required: true
  },
  frameSize: {
    type: [String],
    required: true
  },
  lensType: {
    type: String,
    required: true
  },
  lensCoating: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Eyeglasses', eyeglassesSchema);

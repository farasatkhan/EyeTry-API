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
  brand: {
    type: String,
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
  }],
  frameMaterial: [{
    type: String,
  }],
  frameStyle: [{
    type: String,
  }],
  frameColor: [{
    type: String,
  }],
  frameSize: [{
    type: String,
  }],
  lensType: [{
    type: String,
  }],
  lensCoating: [{
    type: String,
  }],
  images: [{
    type: String,
    required: true
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

module.exports = mongoose.model('Eyeglasses', eyeglassesSchema);

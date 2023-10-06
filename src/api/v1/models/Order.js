const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    items: [{
        frame: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Glasses'
        },
        quantity: {
            type: Number,
            required: true
          },
          frameProperties: {
              frameSize: {
                  type: String,
                  required: true
              },
              frameColor: {
                  type: String,
                  required: true
              },
          },
          lensProperties: {
              lensType: String,
              prescriptionType: String,
              package: String,
              coatings: String,
              glassesType: String,
              upgrades: String,
              transitionLens: {
                  transitionType: String,
                  transitionColor: String,
              },
              sunglassesLens: {
                  sunglassesType: String,
                  color: String,
              },
          },
          prescription: {
              pdType: String,
              pdOneNumber: Number,
              pdLeftNumber: Number,
              pdRightNumber: Number,
              birthYear: Number,
              leftEyeOS: {
                  SPH: String,
                  CYL: String,
                  Axis: String,
                  Prism: String,
                  Base: String,
              },
              rightEyeOD: {
                  SPH: String,
                  CYL: String,
                  Axis: String,
                  Prism: String,
                  Base: String,
              },
          },
    }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

});

// Create the Mongoose model
const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;

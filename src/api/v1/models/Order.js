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
                  SPH: Number,
                  CYL: Number,
                  Axis: Number,
                  Prism: Number,
                  Base: Number,
              },
              rightEyeOD: {
                  SPH: Number,
                  CYL: Number,
                  Axis: Number,
                  Prism: Number,
                  Base: Number,
              },
          },
    }
    ],

    totalPrice: {
        type: String,
        required: true
    },

    paymentMethod : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },

    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
    },  
    
    orderDate: {     
        type: Date,
        default: Date.now,
    },

});

// Create the Mongoose model
const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;

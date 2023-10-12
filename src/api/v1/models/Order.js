const mongoose = require('mongoose');
const CounterModel = require('./OrderCounter'); // Import the Counter schema

const OrderSchema = new mongoose.Schema({
    order_no: {
        type: Number,
        unique: true
    },

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
          },
          frameProperties: {
              frameSize: {
                  type: String,
              },
              frameColor: {
                  type: String,
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
    },

    paymentMethod : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },

    shippingAddress: {
        name: {
            type: String,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
        zipCode: {
            type: String,
        },
    },  
    orderDate: {     
        type: Date,
        default: Date.now,
    },
    deliveryStatus: {
        type: String,
        default: "Pending"
    }
});

// Middleware to auto-increment order_no
OrderSchema.pre('save', async function () {
    const order = this;

    // Finding and increment the sequence_value in the Counter collection
    try {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: 'order_no' }, 
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        // updatinng order_no
        order.order_no = counter.sequence_value; 
    } catch (err) {
        throw err; 
    }
});


const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;

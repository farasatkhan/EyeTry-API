const mongoose = require('mongoose');

const prescriptionInfoSchema = new mongoose.Schema({
    prescriptionName: {
        type: String,
    },
    prescriptionType: {
        type: String,
    },
    dateOfPrescription: {
        type: Date,
    },
    pdType: {
        type: String,
        required: true
      },
      pdOneNumber: {
        type: Number,
        default: null
      },
      pdLeftNumber: {
        type: Number,
        default: null
      },
      pdRightNumber: {
        type: Number,
        default: null
      },
      rightEyeOD: {
        SPH: String,
        CYL: String,
        Axis: String,
        Prism: String,
        Base: String
      },
      leftEyeOS: {
        SPH: String,
        CYL: String,
        Axis: String,
        Prism: String,
        Base: String
      },
      birthYear: {
        type: Number,
        required: true
      }
});

module.exports = mongoose.model('Prescription', prescriptionInfoSchema);
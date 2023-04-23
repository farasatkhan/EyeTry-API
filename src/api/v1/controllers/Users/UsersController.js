require('dotenv').config({ path: './src/config/.env' });

var express = require('express');
var router = express.Router();

var AuthController = require('../Auth/AuthController');

const { comparePassword, hashPassword } = require('../../helpers/hashing');

var Users = require('../../models/User');
var Prescription = require('../../models/Prescription');
var Payment = require('../../models/Payment');

/*
    TODO: Store JWT tokens in the database once authentication is completed
    Currently, we are only using the refreshTokens array to manage refresh tokens.
*/
var tokens = require('../../helpers/refreshToken');

exports.profile = async (req, res, next) => {
    try {
        console.log(req.user);
        const isUserExists = await Users.findById(req.user.id).select("-password");

        if (!isUserExists) return res.status(400).json({message: "User account not found."});

        res.status(200).json(isUserExists);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured"});
    }
}

exports.updatePersonalInformation = (req, res, next) => {
    try {
        const { firstname, lastname, email } = req.body;

        Users.updateOne(
            {_id: req.user.id},
            {$set: {firstName: firstname, lastName: lastname, email: email}}
        ).then((updateResponse) => {

            Users.find({email: email}).then((response) => {
                
                // Generate new access token for user
                const user = {
                    id: response[0]._id.toString(),
                }

                const token = AuthController.generateAccessToken(user);
                const refreshToken = AuthController.generateRefreshToken(user);
            
                tokens.addRefreshTokens(refreshToken);

                res.status(200).json({
                    user: response[0],
                    accessToken: token,
                    refreshToken: refreshToken,
                    message: "User Details are Updated Successfully."
                });

            }).catch((error) => {
                if (error) res.status(404).json({message: "error occured."});
            });

        }).catch((error) => {
            if (error) res.status(404).json({message: "user not found"});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured"});
    }
}

exports.deleteAccount = async (req, res, next) => {
    try {

        const { currentPassword, refreshToken } = req.body;

        console.log(req.user.id)

        const isUserExists = await Users.findById(req.user.id);

        if (!isUserExists) return res.status(400).json({message: "User account not found."});

        const comparedPassword = comparePassword(currentPassword, isUserExists.password);

        if (!comparedPassword) return res.status(400).json({message: "Password is incorrect."});

        Users.findByIdAndDelete(req.user.id).then((response) => {

            // Expire Refresh Token
            tokens.filterRefreshTokens(refreshToken);

            return res.status(204).json({message: "User account is deleted successfully."});

        }).catch((error) => {
            return res.status(403).json({message: "User don't have sufficient permissions to remove account."});
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while deleting user account."});
    }
}


exports.changePassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword, confirmPassword } = req.body;

        console.log(req.user);

        const UserDoc = await Users.findById(req.user.id);

        if (!UserDoc) return res.status(400).json({message: "Invalid user id."});

        const comparedPassword = comparePassword(currentPassword, UserDoc.password);

        if (!comparedPassword) return res.status(400).json({message: "Current password is incorrect."});

        if (newPassword !== confirmPassword) return res.status(400).json({message: "The password and confirm password fields do not match."});

        const newHashedPassword = hashPassword(newPassword);

        Users.findByIdAndUpdate(req.user.id, {password: newHashedPassword}, {new: true}).then((response) => {

            return res.status(204).json({message: "User password is updated successfully."});
        }).catch((err) => {
            console.log(err);
            return res.status(403).json({message: "User don't have sufficient permissions to change password."});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while changing user password."});
    }
}

/* 
    These features can be implemented once reset email is implemented
*/
exports.forgetPassword = async (req, res, next) => {
    try {

        const { email } = req.body;

        const UserDocs = await Users.findOne({email: email});

        if (!UserDocs) return res.status(400).json({message: "User not found."});

        res.status(200).json({message: "Success! check your email for further steps."});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while forgeting user password."});
    }
}

exports.resetPassword = async (req, res, next) => {
    try {

        // Reset Password After User Clicks on Reset Password in email
        res.status(200).json({message: "This feature will be implemented in next sprint."});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while changing user password."});
    }
}

// Add Prescription
exports.addPrescription = (req, res, next) => {

    try {

        const 
        {   
            prescriptionName, prescriptionType, birthYear, dateOfPrescription, renewalReminderDate,
            singleOrDualPD, leftPD, leftSphere, leftCylinder, leftAxis, rightPD, rightSphere, rightCylinder,
            rightAxis, nvadd, leftPrismHorizontal, leftPrismVertical, leftBaseDirectionHorizontal,
            leftBaseDirectionVertical, rightPrismHorizontal, rightPrismVertical, rightBaseDirectionHorizontal,
            rightBaseDirectionVertical

        } = req.body;

        Prescription.create({
            prescriptionName: prescriptionName,
            prescriptionType: prescriptionType,
            birthYear: birthYear,
            dateOfPrescription: dateOfPrescription,
            renewalReminderDate: renewalReminderDate,
            singleOrDualPD: singleOrDualPD,
            pdInformation: {
                left: {
                    leftPD: leftPD,
                    sphere: leftSphere,
                    cylinder: leftCylinder,
                    axis: leftAxis,
                },
                right: {
                    rightPD: rightPD,
                    sphere: rightSphere,
                    cylinder: rightCylinder,
                    axis: rightAxis,
                },
                nvadd: nvadd,
            },
            prismProperties: {
                left: {
                    prismHorizontal: leftPrismHorizontal, 
                    prismVertical: leftPrismVertical, 
                    baseDirectionHorizontal: leftBaseDirectionHorizontal,
                    baseDirectionVertical: leftBaseDirectionVertical
                },
                right: {
                    prismHorizontal: rightPrismHorizontal, 
                    prismVertical: rightPrismVertical, 
                    baseDirectionHorizontal: rightBaseDirectionHorizontal,
                    baseDirectionVertical: rightBaseDirectionVertical
                }
            }
        }).then((prescription) => {

            Users.findByIdAndUpdate(req.user.id, {$push: {prescriptions: prescription._id}}).then((response) => {
                res.status(200).json({message: "Prescription is added."});
            }).catch((error) => {
                console.log(error);
                res.status(400).json({message: "Error occured while linking prescription object to user."});
            });

        }).catch((error) => {
            console.log(error);
            res.status(400).json({message: "400: Unable to Store Prescription."});
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while adding prescription."});
    }
}

// View Particular Prescription
exports.viewPrescription = async (req, res, next) => {
    try {

        const prescriptionId = req.params.prescriptionId;

        const isPrescriptionExists = await Users.findById(req.user.id);

        if (isPrescriptionExists && isPrescriptionExists.prescriptions.indexOf(prescriptionId) === -1) return res.status(404).json({message: "Prescription does not exists."});

        Prescription.findById(prescriptionId).then((prescription) => {
            console.log(prescription)
            res.status(200).send(prescription);
        }).catch((error) => {
            console.log(error);
            res.status(400).json({message: "400: No prescription exists with the following id."});
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while viewing prescription."});
    }
}


// Update Prescription
exports.updatePrescription = async (req, res, next) => {
    try {

        const prescriptionId = req.params.prescriptionId;

        const isPrescriptionExists = await Users.findById(req.user.id);

        if (isPrescriptionExists && isPrescriptionExists.prescriptions.indexOf(prescriptionId) === -1) return res.status(404).json({message: "Prescription does not exists."});

        const 
        {   
            prescriptionName, prescriptionType, birthYear, dateOfPrescription, renewalReminderDate,
            singleOrDualPD, leftPD, leftSphere, leftCylinder, leftAxis, rightPD, rightSphere, rightCylinder,
            rightAxis, nvadd, leftPrismHorizontal, leftPrismVertical, leftBaseDirectionHorizontal,
            leftBaseDirectionVertical, rightPrismHorizontal, rightPrismVertical, rightBaseDirectionHorizontal,
            rightBaseDirectionVertical

        } = req.body;

        const updatedPrescription = {
            prescriptionName: prescriptionName,
            prescriptionType: prescriptionType,
            birthYear: birthYear,
            dateOfPrescription: dateOfPrescription,
            renewalReminderDate: renewalReminderDate,
            singleOrDualPD: singleOrDualPD,
            pdInformation: {
                left: {
                    leftPD: leftPD,
                    sphere: leftSphere,
                    cylinder: leftCylinder,
                    axis: leftAxis,
                },
                right: {
                    rightPD: rightPD,
                    sphere: rightSphere,
                    cylinder: rightCylinder,
                    axis: rightAxis,
                },
                nvadd: nvadd,
            },
            prismProperties: {
                left: {
                    prismHorizontal: leftPrismHorizontal, 
                    prismVertical: leftPrismVertical, 
                    baseDirectionHorizontal: leftBaseDirectionHorizontal,
                    baseDirectionVertical: leftBaseDirectionVertical
                },
                right: {
                    prismHorizontal: rightPrismHorizontal, 
                    prismVertical: rightPrismVertical, 
                    baseDirectionHorizontal: rightBaseDirectionHorizontal,
                    baseDirectionVertical: rightBaseDirectionVertical
                }
            }
        }

        const UpdatedPrescription = await Prescription.findByIdAndUpdate(prescriptionId, updatedPrescription, {new: true});

        if (!UpdatedPrescription) res.status(400).json({message: "400: Error occured while updating prescription."});

        res.status(200).json(UpdatedPrescription);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while updating prescription."});
    }
}


// Delete Prescription
exports.deletePrescription = async (req, res, next) => {
    try {

        const prescriptionId = req.params.prescriptionId;

        const isPrescriptionExists = await Users.findById(req.user.id);

        console.log("Delete Prescription: ", isPrescriptionExists);

        if (isPrescriptionExists && isPrescriptionExists.prescriptions.indexOf(prescriptionId) === -1) return res.status(404).json({message: "Prescription does not exists."});

        const removeFromUserDoc = await Users.findByIdAndUpdate(req.user.id, {$pull: {prescriptions: prescriptionId}});
        
        if (!removeFromUserDoc) res.status(400).json({message: "400: Error occured while removing prescription from user."});

        const deletePrescription = await Prescription.findByIdAndDelete(prescriptionId);

        if (!deletePrescription) res.status(400).json({message: "400: Error occured while removing prescription."});

        res.status(204).json({message: "204: Prescription is removed."});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while deleting prescription."});
    }
}

// Add Payment
exports.addPayment = (req, res, next) => {
    try {

        const 
        {
            paymentType, nameOnCard, cardNumber, expirationMonth, expirationYear, cvv,
            firstName, lastName, country, address, city, state, zipCode

        } = req.body;

        Payment.create({
            paymentType: paymentType,
            nameOnCard: nameOnCard,
            cardNumber: cardNumber,
            expirationMonth: expirationMonth,
            expirationYear: expirationYear,
            cvv: cvv,
            billingInfo: {
                firstName: firstName,
                lastName: lastName,
                country: country,
                address: address,
                city: city,
                state: state,
                zipCode: zipCode
            }
        }).then((payment) => {

            Users.findByIdAndUpdate(req.user.id, {$push: {payments: payment._id}}).then((response) => {
                res.status(200).json({message: "Payment Method is added."});
            }).catch((error) => {
                console.log(error);
                res.status(400).json({message: "Error occured while linking payment object to user."});
            });

        }).catch((error) => {
            res.status(400).json({message: "Unable to store payment information."});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while adding payment."});
    }
}

// View Particular Payment
exports.viewPayment = async (req, res, next) => {
    try {

        const paymentId = req.params.paymentId;

        const isPaymentExists = await Users.findById(req.user.id);

        if (isPaymentExists && isPaymentExists.payments.indexOf(paymentId) === -1) return res.status(404).json({message: "Payment does not exists."});

        Payment.findById(paymentId).then((payment) => {
            console.log(payment)
            res.status(200).send(payment);
        }).catch((error) => {
            console.log(error);
            res.status(400).json({message: "400: No payment exists with the following id."});
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while viewing payment information."});
    }
}


// Update Payment
exports.updatePayment = async (req, res, next) => {
    try {

        const paymentId = req.params.paymentId;

        const isPaymentExists = await Users.findById(req.user.id);

        if (isPaymentExists && isPaymentExists.payments.indexOf(paymentId) === -1) return res.status(404).json({message: "Payments does not exists."});

        const 
        {   
            paymentType, nameOnCard, cardNumber, expirationMonth, expirationYear, cvv,
            firstName, lastName, country, address, city, state, zipCode

        } = req.body;

        const updatedPayment = {
            paymentType: paymentType,
            nameOnCard: nameOnCard,
            cardNumber: cardNumber,
            expirationMonth: expirationMonth,
            expirationYear: expirationYear,
            cvv: cvv,
            billingInfo: {
                firstName: firstName,
                lastName: lastName,
                country: country,
                address: address,
                city: city,
                state: state,
                zipCode: zipCode
            }
        }

        const UpdatedPayment = await Payment.findByIdAndUpdate(paymentId, updatedPayment, {new: true});

        if (!UpdatedPayment) res.status(400).json({message: "400: Error occured while updating payment."});

        res.status(200).json(UpdatedPayment);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while updating payment information."});
    }
}

// Delete Payment
exports.deletePayment = async (req, res, next) => {
    try {

        const paymentId = req.params.paymentId;

        const isPaymentExists = await Users.findById(req.user.id);

        console.log("Delete Payment: ", isPaymentExists);

        if (isPaymentExists && isPaymentExists.payments.indexOf(paymentId) === -1) return res.status(404).json({message: "Payment does not exists."});

        const removeFromUserDoc = await Users.findByIdAndUpdate(req.user.id, {$pull: {payments: paymentId}});
        
        if (!removeFromUserDoc) res.status(400).json({message: "400: Error occured while removing payment method from user."});

        const deletePayment = await Payment.findByIdAndDelete(paymentId);

        if (!deletePayment) res.status(400).json({message: "400: Error occured while removing payment method."});

        res.status(204).json({message: "204: Payment is removed."});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while deleting payment."});
    }
}


// Add Address to AddressBook
// Update Address to AddressBook
// Delete Address to AddressBook
// Upload Try-On Images
// Remove Try-On Images
// Manage Wishlist [save item to wishlist]
// Manage Giftcard [save item to giftcards]
// Redeem Giftcards
// Upload Profile Image
// Delete Profile Image
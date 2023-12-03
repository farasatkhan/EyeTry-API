require('dotenv').config({ path: './src/config/.env' });

var fs = require('fs');

var express = require('express');
var router = express.Router();

const S3Storage = require('../../services/S3Storage');

var AuthController = require('../Auth/AuthController');

const { comparePassword, hashPassword, randomImageName } = require('../../helpers/hashing');

var Users = require('../../models/User');
var Prescription = require('../../models/Prescription');
var Payment = require('../../models/Payment');
var GiftCard = require('../../models/Giftcard');
var Glasses = require('../../models/Products/Glasses');

/*
    TODO: Store JWT tokens in the database once authentication is completed
    Currently, we are only using the refreshTokens array to manage refresh tokens.
*/
var tokens = require('../../helpers/refreshToken');

exports.profile = async (req, res, next) => {
    try {
        console.log(req.user);
        const isUserExists = await Users.findById(req.user.id).select("-password");

        if (!isUserExists) return res.status(400).json({ message: "User account not found." });

        res.status(200).json(isUserExists);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.updatePersonalInformation = (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;

        Users.updateOne(
            { _id: req.user.id },
            { $set: { firstName: firstname, lastName: lastname, email: email } }
        ).then((updateResponse) => {

            Users.find({ email: email }).then((response) => {

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
                if (error) res.status(404).json({ message: "error occured." });
            });

        }).catch((error) => {
            if (error) res.status(404).json({ message: "user not found" });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.deleteAccount = async (req, res, next) => {
    try {

        const { currentPassword, refreshToken } = req.body;

        console.log(req.user.id)

        const isUserExists = await Users.findById(req.user.id);

        if (!isUserExists) return res.status(400).json({ message: "User account not found." });

        const comparedPassword = comparePassword(currentPassword, isUserExists.password);

        if (!comparedPassword) return res.status(400).json({ message: "Password is incorrect." });

        Users.findByIdAndDelete(req.user.id).then((response) => {

            // Expire Refresh Token
            tokens.filterRefreshTokens(refreshToken);

            return res.status(204).json({ message: "User account is deleted successfully." });

        }).catch((error) => {
            return res.status(403).json({ message: "User don't have sufficient permissions to remove account." });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while deleting user account." });
    }
}


exports.changePassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword, confirmPassword } = req.body;

        console.log(req.user);

        const UserDoc = await Users.findById(req.user.id);

        if (!UserDoc) return res.status(400).json({ message: "Invalid user id." });

        const comparedPassword = comparePassword(currentPassword, UserDoc.password);

        if (!comparedPassword) return res.status(400).json({ message: "Current password is incorrect." });

        if (newPassword !== confirmPassword) return res.status(400).json({ message: "The password and confirm password fields do not match." });

        const newHashedPassword = hashPassword(newPassword);

        Users.findByIdAndUpdate(req.user.id, { password: newHashedPassword }, { new: true }).then((response) => {

            return res.status(204).json({ message: "User password is updated successfully." });
        }).catch((err) => {
            console.log(err);
            return res.status(403).json({ message: "User don't have sufficient permissions to change password." });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while changing user password." });
    }
}

/* 
    These features can be implemented once reset email is implemented
*/
exports.forgetPassword = async (req, res, next) => {
    try {

        const { email } = req.body;

        const UserDocs = await Users.findOne({ email: email });

        if (!UserDocs) return res.status(400).json({ message: "User not found." });

        res.status(200).json({ message: "Success! check your email for further steps." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while forgeting user password." });
    }
}

exports.resetPassword = async (req, res, next) => {
    try {

        // Reset Password After User Clicks on Reset Password in email
        res.status(200).json({ message: "This feature will be implemented in next sprint." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while changing user password." });
    }
}

// Add Prescription
exports.addPrescription = (req, res, next) => {

    try {

        const
            {
                prescriptionName,
                prescriptionType,
                pdType,
                pdOneNumber,
                pdLeftNumber,
                pdRightNumber,
                leftEyeOS,
                rightEyeOD,
                birthYear,
                dateOfPrescription

            } = req.body;

        Prescription.create({
            prescriptionName: prescriptionName,
            prescriptionType: prescriptionType,
            dateOfPrescription: dateOfPrescription,
            pdType: pdType,
            pdOneNumber: pdOneNumber,
            pdLeftNumber: pdLeftNumber,
            pdRightNumber: pdRightNumber,
            leftEyeOS: leftEyeOS,
            rightEyeOD: rightEyeOD,
            birthYear: birthYear,


        }).then((prescription) => {

            Users.findByIdAndUpdate(req.user.id, { $push: { prescriptions: prescription._id } }).then((response) => {
                res.status(200).json({ message: "Prescription is added." });
            }).catch((error) => {
                console.log(error);
                res.status(400).json({ message: "Error occured while linking prescription object to user." });
            });

        }).catch((error) => {
            console.log(error);
            res.status(400).json({ message: "400: Unable to Store Prescription." });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while adding prescription." });
    }
}

// view all Prescriptions
exports.viewAllPrescriptions = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.id).populate('prescriptions');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.prescriptions || user.prescriptions.length === 0) {
            return res.status(404).json({ message: "No prescriptions found for this user." });
        }

        res.status(200).send(user.prescriptions);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occurred while viewing information." });
    }
}


// View Particular Prescription
exports.viewPrescription = async (req, res, next) => {
    try {

        const prescriptionId = req.params.prescriptionId;

        const isPrescriptionExists = await Users.findById(req.user.id);

        if (isPrescriptionExists && isPrescriptionExists.prescriptions.indexOf(prescriptionId) === -1) return res.status(404).json({ message: "Prescription does not exists." });

        Prescription.findById(prescriptionId).then((prescription) => {
            console.log(prescription)
            res.status(200).send(prescription);
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ message: "400: No prescription exists with the following id." });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while viewing prescription." });
    }
}


// Update Prescription
exports.updatePrescription = async (req, res, next) => {
    try {

        const prescriptionId = req.params.prescriptionId;

        const isPrescriptionExists = await Users.findById(req.user.id);

        if (isPrescriptionExists && isPrescriptionExists.prescriptions.indexOf(prescriptionId) === -1) return res.status(404).json({ message: "Prescription does not exists." });

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

        const UpdatedPrescription = await Prescription.findByIdAndUpdate(prescriptionId, updatedPrescription, { new: true });

        if (!UpdatedPrescription) return res.status(400).json({ message: "400: Error occured while updating prescription." });

        res.status(200).json(UpdatedPrescription);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while updating prescription." });
    }
}


// Delete Prescription
exports.deletePrescription = async (req, res, next) => {
    try {

        const prescriptionId = req.params.prescriptionId;

        const isPrescriptionExists = await Users.findById(req.user.id);

        console.log("Delete Prescription: ", isPrescriptionExists);

        if (isPrescriptionExists && isPrescriptionExists.prescriptions.indexOf(prescriptionId) === -1) return res.status(404).json({ message: "Prescription does not exists." });

        const removeFromUserDoc = await Users.findByIdAndUpdate(req.user.id, { $pull: { prescriptions: prescriptionId } });

        if (!removeFromUserDoc) return res.status(400).json({ message: "400: Error occured while removing prescription from user." });

        const deletePrescription = await Prescription.findByIdAndDelete(prescriptionId);

        if (!deletePrescription) return res.status(400).json({ message: "400: Error occured while removing prescription." });

        res.status(204).json({ message: "204: Prescription is removed." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while deleting prescription." });
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

            Users.findByIdAndUpdate(req.user.id, { $push: { payments: payment._id } }).then((response) => {
                res.status(200).json({ message: "Payment Method is added." });
            }).catch((error) => {
                console.log(error);
                res.status(400).json({ message: "Error occured while linking payment object to user." });
            });

        }).catch((error) => {
            res.status(400).json({ message: "Unable to store payment information." });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while adding payment." });
    }
}

// view all payments
exports.viewAllPayments = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.id).populate('payments');

        if (!user) return res.status(404).json({ message: "Payment does not exists." });

        res.status(200).send(user.payments);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while viewing information." });
    }
}

// View Particular Payment
exports.viewPayment = async (req, res, next) => {
    try {

        const paymentId = req.params.paymentId;

        const isPaymentExists = await Users.findById(req.user.id);

        if (isPaymentExists && isPaymentExists.payments.indexOf(paymentId) === -1) return res.status(404).json({ message: "Payment does not exists." });

        Payment.findById(paymentId).then((payment) => {
            console.log(payment)
            res.status(200).send(payment);
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ message: "400: No payment exists with the following id." });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while viewing payment information." });
    }
}


// Update Payment
exports.updatePayment = async (req, res, next) => {
    try {

        const paymentId = req.params.paymentId;

        const isPaymentExists = await Users.findById(req.user.id);

        if (isPaymentExists && isPaymentExists.payments.indexOf(paymentId) === -1) return res.status(404).json({ message: "Payments does not exists." });

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

        const UpdatedPayment = await Payment.findByIdAndUpdate(paymentId, updatedPayment, { new: true });

        if (!UpdatedPayment) return res.status(400).json({ message: "400: Error occured while updating payment." });

        res.status(200).json(UpdatedPayment);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while updating payment information." });
    }
}

// Delete Payment
exports.deletePayment = async (req, res, next) => {
    try {

        const paymentId = req.params.paymentId;

        const isPaymentExists = await Users.findById(req.user.id);

        console.log("Delete Payment: ", isPaymentExists);

        if (isPaymentExists && isPaymentExists.payments.indexOf(paymentId) === -1) return res.status(404).json({ message: "Payment does not exists." });

        const removeFromUserDoc = await Users.findByIdAndUpdate(req.user.id, { $pull: { payments: paymentId } });

        if (!removeFromUserDoc) return res.status(400).json({ message: "400: Error occured while removing payment method from user." });

        const deletePayment = await Payment.findByIdAndDelete(paymentId);

        if (!deletePayment) return res.status(400).json({ message: "400: Error occured while removing payment method." });

        res.status(204).json({ message: "204: Payment is removed." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while deleting payment." });
    }
}


// Add Address to AddressBook
exports.addAddress = async (req, res, next) => {
    try {

        const { firstName, lastName, phone, currentAddress, city, state, country, zipCode } = req.body;

        const newAddress = {
            firstName: firstName,
            lastname: lastName,
            phone: phone,
            currentAddress: currentAddress,
            city: city,
            state: state,
            country: country,
            zipCode: zipCode
        }

        const addedAddress = await Users.findByIdAndUpdate(req.user.id, { $push: { addressBook: newAddress } }, { new: true });

        if (!addedAddress) return res.status(404).json({ message: "Error occured while adding address to addressbook." });

        res.status(200).json(addedAddress);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while adding address." });
    }
}

// View addresses
exports.viewAllAddresses = async (req, res, next) => {
    try {

        const user = await Users.findById({ _id: req.user.id }).select('addressBook');
        const addresses = user.addressBook;
        console.log(addresses)
        if (!addresses) return res.status(404).json({ message: "Error occured while viewing address in addressbook." });

        res.status(200).json(addresses);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while viewing address." });
    }
}



// View Particular Address
exports.viewAddress = async (req, res, next) => {
    try {

        const addressId = req.params.addressId;

        const viewAddress = await Users.findById({ _id: req.user.id }).select({ addressBook: { $elemMatch: { _id: addressId } } });

        if (!viewAddress) return res.status(404).json({ message: "Error occured while viewing address in addressbook." });

        res.status(200).json(viewAddress);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while viewing address." });
    }
}

// Update Address to AddressBook
exports.updateAddress = async (req, res, next) => {
    try {

        const addressId = req.params.addressId;

        const { firstName, lastName, phone, currentAddress, city, state, country, zipCode } = req.body;

        const updatedAddress = await Users.findOneAndUpdate(
            { _id: req.user.id, 'addressBook._id': addressId },
            {
                $set: {
                    "addressBook.$.firstName": firstName,
                    "addressBook.$.lastName": lastName,
                    "addressBook.$.phone": phone,
                    "addressBook.$.currentAddress": currentAddress,
                    "addressBook.$.city": city,
                    "addressBook.$.state": state,
                    "addressBook.$.country": country,
                    "addressBook.$.zipCode": zipCode,
                }
            }, { new: true });

        if (!updatedAddress) return res.status(400).json({ message: "Unable to update address." });

        res.status(200).json(updatedAddress);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while updating address." });
    }
}

// Delete Address to AddressBook
exports.deleteAddress = async (req, res, next) => {
    try {

        const addressBookId = req.params.addressId;

        const removeFromUserDoc = await Users.findByIdAndUpdate(req.user.id, { $pull: { addressBook: { _id: addressBookId } } });

        if (!removeFromUserDoc) return res.status(400).json({ message: "400: Error occured while removing address from user." });

        res.status(204).json(removeFromUserDoc);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while deleting address." });
    }
}

// Add to Wishlist
exports.addWishlist = async (req, res, next) => {
    try {

        console.log("working this");

        const { productId } = req.body;

        const addedWishlistItem = await Users.findByIdAndUpdate({ _id: req.user.id }, { $push: { wishlist: productId } });

        if (!addedWishlistItem) return res.status(400).json({ message: "400: Error occured while adding item to users." });

        res.status(200).json({ message: "Product added to wishlist." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while adding item to wishlist." });
    }
}

// Remove from Wishlist
exports.removeWishlist = async (req, res, next) => {
    try {

        const productId = req.params.productId;

        const removeFromUserDoc = await Users.findByIdAndUpdate(req.user.id, { $pull: { wishlist: productId } });

        if (!removeFromUserDoc) return res.status(400).json({ message: "400: Error occured while removing item from wishlist from user." });

        res.status(204).json(removeFromUserDoc);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while removing item from wishlist." });
    }
}

// View Wishlists
/*
    TODO: View Wishlist should return products instead of just their ids.
*/
exports.viewWishlist = async (req, res, next) => {
    try {

        const viewWishlistProducts = await Users.findById({ _id: req.user.id }).select('wishlist').populate('wishlist');

        if (!viewWishlistProducts) return res.status(404).json({ message: "Error occured while viewing wishlist items." });

        res.status(200).json(viewWishlistProducts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while viewing item from wishlist." });
    }
}

// Redeem Giftcards
exports.redeemGiftcard = async (req, res, next) => {
    try {

        const { code } = req.body;

        const redeemGiftcard = await GiftCard.find({ code: code });

        if (!redeemGiftcard || redeemGiftcard.length === 0) return res.status(404).json({ message: "Invalid giftcard code." });

        console.log(redeemGiftcard[0].status);

        if (redeemGiftcard[0].status !== 'active') return res.status(404).json({ message: "Giftcard is expired." });

        const redeemingGiftcard = await GiftCard.findOneAndUpdate({ code: code }, { $push: { usedBy: req.user.id } });

        if (!redeemingGiftcard) return res.status(404).json({ message: "Error occured while redeeming." });

        res.status(200).json({
            code: redeemGiftcard[0].code,
            value: redeemGiftcard[0].value,
            currency: redeemGiftcard[0].currency
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while redeeming giftcards." });
    }
}

// Upload Profile Image - S3
exports.uploadProfileImageS3 = async (req, res, next) => {
    try {

        if (!req.file) return res.status(400).json({ message: "Error occured while uploading image" });

        const randImageName = randomImageName();

        const s3Upload = await S3Storage.uploadFile(req.file, randImageName);

        if (!s3Upload) return res.status(400).json({ message: "Error occured while uploading to s3" });

        const profilePicture = await Users.findByIdAndUpdate(req.user.id, { profilePicture: randImageName });

        if (!profilePicture) return res.status(400).json({ message: "Error occured while uploading image to db" });

        res.status(200).json({ message: "Image uploaded successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while uploading images" });
    }
}

// View Profile Image - S3
exports.viewProfileImageS3 = async (req, res, next) => {
    try {

        const imageId = await Users.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({ message: "Error occured while retriving image id." });

        const url = await S3Storage.downloadFile(imageId.profilePicture);

        if (!url) return res.status(400).json({ message: "Error occured while viewing image from s3" });

        res.status(200).json({ profilePicture: url });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while viewing images" });
    }
}

// Delete Profile Image - S3
exports.deleteProfileImageS3 = async (req, res, next) => {
    try {

        const imageId = await Users.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({ message: "Error occured while retriving image id." });

        const removedImage = await S3Storage.deleteFile(imageId.profilePicture);

        if (!removedImage) return res.status(400).json({ message: "Error occured while removing image from s3" });

        const removeFromUserDocs = await Users.findByIdAndUpdate(req.user.id, { profilePicture: '' });

        if (!removeFromUserDocs) return res.status(400).json({ message: "Error occured while removing image from db" });

        res.status(200).json({ message: "Image is removed from successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while deleting images" });
    }
}

// Upload Try-On Images - S3
exports.uploadTryOnImageS3 = async (req, res, next) => {
    try {

        if (!req.file) return res.status(400).json({ message: "Error occured while uploading image" });

        const randImageName = randomImageName();

        const s3Upload = await S3Storage.uploadFile(req.file, randImageName);

        if (!s3Upload) return res.status(400).json({ message: "Error occured while uploading to s3" });

        const tryOnImage = await Users.findByIdAndUpdate(req.user.id, { $push: { tryOnImages: randImageName } });

        if (!tryOnImage) return res.status(400).json({ message: "Error occured while uploading image to db" });

        res.status(200).json({ message: "Try On Image uploaded successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while uploading images" });
    }
}

// View Try-On Images - S3
exports.viewTryOnImagesS3 = async (req, res, next) => {
    try {

        const imageId = await Users.findById(req.user.id).select('tryOnImages');

        if (imageId && imageId.tryOnImages.length === 0) return res.status(400).json({ message: "No try on images are present." });

        const urls = await S3Storage.viewAllFiles(imageId.tryOnImages);

        if (!urls) return res.status(400).json({ message: "Error occured while viewing image from s3" });

        res.status(200).json({ tryonImages: urls });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while viewing images" });
    }
}

// Remove Try-On Images - S3
exports.deleteTryOnImageS3 = async (req, res, next) => {
    try {

        const removeTryOnImageId = req.params.tryOnImageId;

        const userDoc = await Users.findById(req.user.id).select('tryOnImages');

        if (userDoc && userDoc.tryOnImages.indexOf(removeTryOnImageId) === -1) return res.status(400).json({ message: "No try on images are present." });

        const removedImage = await S3Storage.deleteFile(removeTryOnImageId);

        if (!removedImage) return res.status(400).json({ message: "Error occured while removing image from s3" });

        const removeFromUserDocs = await Users.findByIdAndUpdate(req.user.id, { $pull: { tryOnImages: removeTryOnImageId } });

        if (!removeFromUserDocs) return res.status(400).json({ message: "Error occured while removing image from db" });

        res.status(200).json({ message: "Image is removed from successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while deleting images" });
    }
}

// Upload Profile Image - Server
exports.uploadProfileImageServer = async (req, res, next) => {
    try {

        if (!req.file) return res.status(400).json({ message: "Error occured while uploading image" });

        const imageId = await Users.findById(req.user.id).select('profilePicture');

        // If Profile Picture already exists then remove the old image.
        if ((imageId && imageId.profilePicture)) fs.unlinkSync('./public/uploads/profile_images/' + imageId.profilePicture);

        const profilePicture = await Users.findByIdAndUpdate(req.user.id, { profilePicture: req.file.filename }, { new: true });

        if (!profilePicture) return res.status(400).json({ message: "Error occured while uploading image to db" });

        res.status(200).json({ message: "Image uploaded successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while uploading image to server" })
    }
}

// View Profile Image - Server
exports.viewProfileImageServer = async (req, res, next) => {
    try {

        const imageId = await Users.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({ message: "Error occured while retriving image id." });

        res.status(200).json(
            {
                profilePicture: imageId.profilePicture,
                location: '/uploads/profile_images/' + imageId.profilePicture
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while viewing image from server" })
    }
}

exports.viewProfileImageServer = async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const imageId = await Users.findById(userId).select('profilePicture');
        
        if (!(imageId && imageId.profilePicture)) return res.status(404).json({ message: "Image not found" });

        res.status(200).json(
            {
                profilePicture: imageId.profilePicture,
                location: '/uploads/profile_images/' + imageId.profilePicture
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while viewing image from server" })
    }
}

// Delete Profile Image - Server
exports.deleteProfileImageServer = async (req, res, next) => {
    try {
        const imageId = await Users.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({ message: "Error occured while retriving image id." });

        fs.unlinkSync('./public/uploads/profile_images/' + imageId.profilePicture);

        const removeFromUserDocs = await Users.findByIdAndUpdate(req.user.id, { profilePicture: '' });

        if (!removeFromUserDocs) res.status(400).json({ message: "Error occured while removing image from db" });

        res.status(200).json({ message: "Image is removed from successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while deleting image from server" })
    }
}


// Upload Try-On Images - Server
exports.uploadTryOnImageServer = async (req, res, next) => {
    try {

        if (!req.file) return res.status(400).json({ message: "Error occured while uploading image" });

        const tryOnImage = await Users.findByIdAndUpdate(req.user.id, { $push: { tryOnImages: req.file.filename } });

        if (!tryOnImage) return res.status(400).json({ message: "Error occured while uploading image to db" });

        res.status(200).json({ message: "Try On Image uploaded successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while uploading images" });
    }
}

// View Try-On Images - Server
exports.viewTryOnImagesServer = async (req, res, next) => {
    try {

        const imageId = await Users.findById(req.user.id).select('tryOnImages');

        if (imageId && imageId.tryOnImages.length === 0) return res.status(400).json({ message: "No try on images are present." });

        res.status(200).json(
            {
                tryonImages: imageId.tryOnImages,
                locations: imageId.tryOnImages.map(image => '/uploads/tryon_images/' + image)
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while viewing images" });
    }
}

// Remove Try-On Images - Server
exports.deleteTryOnImageServer = async (req, res, next) => {
    try {

        const removeTryOnImageId = req.params.tryOnImageId;

        const userDoc = await Users.findById(req.user.id).select('tryOnImages');

        if (userDoc && userDoc.tryOnImages.indexOf(removeTryOnImageId) === -1) return res.status(400).json({ message: "No try on images are present." });

        fs.unlinkSync('./public/uploads/tryon_images/' + removeTryOnImageId);

        const removeFromUserDocs = await Users.findByIdAndUpdate(req.user.id, { $pull: { tryOnImages: removeTryOnImageId } });

        if (!removeFromUserDocs) return res.status(400).json({ message: "Error occured while removing image from db" });

        res.status(200).json({ message: "Image is removed from successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while deleting images" });
    }
}

exports.submitVisionAssessmentResult = async (req, res, next) => {
    try {

        const { testType, status } = req.body;

        const submitVisionAssessmentTest = await Users.findByIdAndUpdate(
            { _id: req.user.id },
            {
                $push: {
                    visionAssessments: {
                        testType: testType,
                        status: status
                    }
                }
            }
        );

        if (!submitVisionAssessmentTest) return res.status(400).json({ message: "400: Error occured while submitting vision assessment result." });

        res.status(200).json({ message: "Test Result Submitted." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error occured in submitting vision assessment route." })
    }
}

exports.viewVisionAssessmentResult = async (req, res, next) => {
    try {

        const visionAssessmentsResults = await Users.findById({ _id: req.user.id }).select('visionAssessments');

        if (!visionAssessmentsResults) return res.status(400).json({ message: "400: Error occured while viewing vision assessment results" });

        if (visionAssessmentsResults.visionAssessments.length <= 0) return res.status(200).json({ message: "No vision assessment test results are present." })

        res.status(200).json(visionAssessmentsResults);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error occured in viewing vision assessment route." })
    }
}
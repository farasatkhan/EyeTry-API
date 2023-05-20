var fs = require('fs');

var AdminModel = require('../../models/Admin');
var Giftcard = require('../../models/Giftcard');

var AdminAuthController = require('../Auth/AdminAuthController');

const { comparePassword, hashPassword } = require('../../helpers/hashing');

/*
    TODO: Store JWT tokens in the database once authentication is completed
    Currently, we are only using the refreshTokens array to manage refresh tokens.
*/
var tokens = require('../../helpers/refreshToken');

exports.profile = async (req, res, next) => {
    try {
        const isAdminExists = await AdminModel.findById(req.user.id).select("-password");

        if (!isAdminExists) return res.status(400).json({message: "Admin account not found."});

        res.status(200).json(isAdminExists);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured"});
    }
}

exports.updatePersonalInformation = (req, res, next) => {
    try {
        const { firstname, lastname, email } = req.body;

        AdminModel.updateOne(
            {_id: req.user.id},
            {$set: {firstName: firstname, lastName: lastname, email: email}}
        ).then((updateResponse) => {

            AdminModel.find({email: email}).then((response) => {
                
                // Generate new access token for user
                const user = {
                    id: response[0]._id.toString(),
                }

                const token = AdminAuthController.generateAccessToken(user);
                const refreshToken = AdminAuthController.generateRefreshToken(user);
            
                tokens.addRefreshTokens(refreshToken);

                res.status(200).json({
                    user: response[0],
                    accessToken: token,
                    refreshToken: refreshToken,
                    message: "Admin Details are Updated Successfully."
                });

            }).catch((error) => {
                if (error) res.status(404).json({message: "error occured."});
            });

        }).catch((error) => {
            if (error) res.status(404).json({message: "admin not found"});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured"});
    }
}

// Add to Giftcard [Admin]
exports.addGiftcard = async (req, res, next) => {
    try {

        const { code, value, currency, status, expirationDate } = req.body;

        const AddedGiftcard = await Giftcard.create({
            code: code,
            value: value,
            currency: currency,
            status: status,
            expirationDate: expirationDate
        });

        if (!AddedGiftcard) res.status(400).json({message: "400: Error occured while adding giftcards."});

        res.status(200).json(AddedGiftcard);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while adding giftcards."});
    }
}

exports.changePassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword, confirmPassword } = req.body;

        const AdminDoc = await AdminModel.findById(req.user.id);

        if (!AdminDoc) return res.status(400).json({message: "Invalid user id."});

        const comparedPassword = comparePassword(currentPassword, AdminDoc.password);

        if (!comparedPassword) return res.status(400).json({message: "Current password is incorrect."});

        if (newPassword !== confirmPassword) return res.status(400).json({message: "The password and confirm password fields do not match."});

        const newHashedPassword = hashPassword(newPassword);

        AdminModel.findByIdAndUpdate(req.user.id, {password: newHashedPassword}, {new: true}).then((response) => {

            return res.status(204).json({message: "Admin password is updated successfully."});
        }).catch((err) => {
            console.log(err);
            return res.status(403).json({message: "Admin don't have sufficient permissions to change password."});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while changing user password."});
    }
}

// View Giftcards [Admin]
exports.viewGiftcard = (req, res, next) => {
    try {

        Giftcard.find({}).then((response) => {

            res.status(200).json(response);
        }).catch((error) => {
            res.status(400).json({message: "500: Error occured while viewing giftcards."});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while viewing giftcards."});
    }
}


// Update Giftcards [Admin]
exports.updateGiftcard = async (req, res, next) => {
    try {

        const giftcardId = req.params.giftcardId;

        const { code, value, currency, status, expirationDate } = req.body;

        const newUpdatedGiftcard = {
            code: code,
            value: value,
            currency: currency,
            status: status,
            expirationDate: expirationDate
        }

        const updatedGiftcard = await Giftcard.findByIdAndUpdate(giftcardId, newUpdatedGiftcard, {new: true});

        if (!updatedGiftcard) res.status(400).json({message: "400: Error occured while updating giftcard."});

        res.status(200).json(updatedGiftcard);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while updating giftcards."});
    }
}

// Delete Giftcards [Admin]
exports.deleteGiftcard = async (req, res, next) => {
    try {

        const giftcardId = req.params.giftcardId;

        const deleteGiftcard = await Giftcard.findByIdAndDelete(giftcardId);

        if (!deleteGiftcard) res.status(400).json({message: "Giftcard does not exists."});

        res.status(204).json(deleteGiftcard);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while deleting giftcards."});
    }
}

// Upload Profile Image - Server
exports.uploadProfileImageServer = async (req, res, next) => {
    try {
        
        if (!req.file) return res.status(400).json({message: "Error occured while uploading image"});

        const profilePicture = await AdminModel.findByIdAndUpdate(req.user.id, {profilePicture: req.file.filename}, {new: true});

        if (!profilePicture) return res.status(400).json({message: "Error occured while uploading image to db"});

        res.status(200).json({message: "Image uploaded successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Error occured while uploading image to server"})
    }
}

// View Profile Image - Server
exports.viewProfileImageServer = async (req, res, next) => {
    try {

        const imageId = await AdminModel.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({message: "Error occured while retriving image id."});

        res.status(200).json(
            {
                profilePicture: imageId.profilePicture,
                location: '/uploads/profile_images/' + imageId.profilePicture
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Error occured while viewing image from server"})
    }
}

// Delete Profile Image - Server
exports.deleteProfileImageServer = async (req, res, next) => {
    try {
        const imageId = await AdminModel.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({message: "Error occured while retriving image id."});

        fs.unlinkSync('./public/uploads/profile_images/' + imageId.profilePicture);

        const removeFromUserDocs = await AdminModel.findByIdAndUpdate(req.user.id, {profilePicture: ''});

        if (!removeFromUserDocs) res.status(400).json({message: "Error occured while removing image from db"});

        res.status(200).json({message: "Image is removed from successfully."});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Error occured while deleting image from server"})
    }
}
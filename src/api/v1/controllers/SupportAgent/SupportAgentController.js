var fs = require('fs');

var CustomerSupportModel = require('../../models/CustomerSupport');
var CustomerSupportAuthController = require('../Auth/CustomerSupportAuthController')


const { comparePassword, hashPassword } = require('../../helpers/hashing');

/*
    TODO: Store JWT tokens in the database once authentication is completed
    Currently, we are only using the refreshTokens array to manage refresh tokens.
*/
var tokens = require('../../helpers/refreshToken');

exports.profile = async (req, res, next) => {
    try {

        const isUserExists = await CustomerSupportModel.findById(req.user.id).select("-password -role");

        if (!isUserExists) return res.status(400).json({ message: "Support Agent account not found." });

        res.status(200).json(isUserExists);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.updatePersonalInformation = (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;
        CustomerSupportModel.updateOne(
            { _id: req.user.id },
            { $set: { firstName: firstName, lastName: lastName, email: email } }
        ).then((updateResponse) => {
            CustomerSupportModel.find({ _id: req.user.id }).then((response) => {
                // Generate new access token for Agent
                const agent = {
                    id: response[0]._id.toString(),
                }

                const token = CustomerSupportAuthController.generateAccessToken(agent);
                const refreshToken = CustomerSupportAuthController.generateRefreshToken(agent);

                tokens.addRefreshTokens(refreshToken);

                res.status(200).json({
                    user: response[0],
                    accessToken: token,
                    refreshToken: refreshToken,
                    message: "Agent Details are Updated Successfully."
                });

            }).catch((error) => {
                if (error) res.status(404).json({ message: "error occured." });
            });

        }).catch((error) => {
            if (error) res.status(404).json({ message: "Agent not found" });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured" });
    }
}

exports.changePassword = async (req, res, next) => {
    try {

        const agentID = req.user.id;

        console.log(agentID);

        const { currentPassword, newPassword, confirmPassword } = req.body;

        const AgentDoc = await CustomerSupportModel.findById(agentID);
        // const AgentDoc = await CustomerSupportModel.findById(req.user.id);

        console.log("found agent doc: ", AgentDoc);

        if (!AgentDoc) return res.status(400).json({ message: "Invalid agent id." });

        const comparedPassword = comparePassword(currentPassword, AgentDoc.password);

        if (!comparedPassword) return res.status(400).json({ message: "Current password is incorrect." });

        if (newPassword !== confirmPassword) return res.status(400).json({ message: "The password and confirm password fields do not match." });

        const newHashedPassword = hashPassword(newPassword);

        CustomerSupportModel.findByIdAndUpdate(agentID, { password: newHashedPassword }, { new: true }).then((response) => {

            return res.status(200).json({ message: "Password is updated successfully." });
        }).catch((err) => {
            console.log(err);
            return res.status(403).json({ message: "Agent don't have sufficient permissions to change password." });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "500: Error occured while changing user password." });
    }
}



// Upload Profile Image - Server
exports.uploadProfileImageServer = async (req, res, next) => {
    try {

        if (!req.file) return res.status(400).json({ message: "Error occured while uploading image" });

        const imageId = await CustomerSupportModel.findById(req.user.id).select('profilePicture');

        // If Profile Picture already exists then remove the old image.
        if ((imageId && imageId.profilePicture)) fs.unlinkSync('./public/uploads/profile_images/' + imageId.profilePicture);
        console.log("1")
        const profilePicture = await CustomerSupportModel.findByIdAndUpdate(req.user.id, { profilePicture: req.file.filename }, { new: true });
        console.log("2")

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

        const imageId = await CustomerSupportModel.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({ message: "No Profile Picture Present " });

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
        const imageId = await CustomerSupportModel.findById(req.user.id).select('profilePicture');

        if (!(imageId && imageId.profilePicture)) return res.status(400).json({ message: "Error occured while retriving image id." });

        fs.unlinkSync('./public/uploads/profile_images/' + imageId.profilePicture);

        const removeFromUserDocs = await CustomerSupportModel.findByIdAndUpdate(req.user.id, { profilePicture: '' });

        if (!removeFromUserDocs) return res.status(400).json({ message: "Error occured while removing image from db" });

        res.status(200).json({ message: "Image is removed from successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error occured while deleting image from server" })
    }
}






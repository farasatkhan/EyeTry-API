require('dotenv').config({ path: './src/config/.env' });

var express = require('express');
var router = express.Router();

var AuthController = require('../Auth/AuthController');

const { comparePassword } = require('../../helpers/hashing');

var Users = require('../../models/User');

/*
    TODO: Store JWT tokens in the database once authentication is completed
    Currently, we are only using the refreshTokens array to manage refresh tokens.
*/
var tokens = require('../../helpers/refreshToken');

exports.profile = async (req, res, next) => {
    try {

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
            {email: req.user.email},
            {$set: {firstName: firstname, lastName: lastname, email: email}}
        ).then((updateResponse) => {

            Users.find({email: email}).then((response) => {
                
                // Generate new access token for user
                const user = {
                    _id: response[0]._id.toString(),
                    email: response[0].email
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




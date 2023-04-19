var express = require('express');
var router = express.Router();


var Users = require('../../models/User');

exports.profile = (req, res, next) => {
    try {

        Users.find({email: req.user.email}).then((result) => {
            res.status(200).send(result);
        }).catch((error) => {
            if (error) res.status(400).json({message: "user not found"});
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured"});
    }
}
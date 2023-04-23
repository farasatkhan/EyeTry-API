require('dotenv').config({ path: './src/config/.env' });

var express = require('express');
var router = express.Router();

var Product = require('../models/Product');

exports.addProduct = (req, res, next) => {
    try {

        const { productName } = req.body;

        Product.create({productName: productName}).then((response) => {
            res.status(200).json(response);
        }).catch((error) => {
            console.log(error);
            res.status(400).json({message: "Error Occured while adding products to test route."});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured whiling adding products."});
    }
}

exports.viewProducts = (req, res, next) => {
    try {

        Product.find({}).then((response) => {
            res.status(200).json(response);
        }).catch((error) => {
            console.log(error);
            res.status(400).json({message: "Error Occured while viewing products from test route."});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured whiling adding products."});
    }
}
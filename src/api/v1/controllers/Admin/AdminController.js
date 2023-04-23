var express = require('express');
var router = express.Router();

var Giftcard = require('../../models/Giftcard');

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
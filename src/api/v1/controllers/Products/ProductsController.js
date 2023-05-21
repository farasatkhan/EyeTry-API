var fs = require('fs');

var FrameModel = require('../../models/Frames');
var LensModel = require('../../models/Lens');
var EyeglassesModel = require('../../models/Eyeglasses');


exports.addFrame = async (req, res, next) => {
    try {

        const {
            name, price, quantity, brand, type, category, subcategory, 
            shortDescription, detailedDescription,
            tags, frameMaterial, frameStyle, frameColor, frameSize
        } = req.body;

        const frameInformation = await FrameModel.create({
            name: name,
            price: price,
            quantity: quantity,
            brand: brand,
            type: type,
            category: category,
            subcategory: subcategory,
            shortDescription: shortDescription,
            detailedDescription: detailedDescription,
            tags: tags,
            frameMaterial: frameMaterial,
            frameStyle: frameStyle,
            frameColor: frameColor,
            frameSize: frameSize
        });

        if (!frameInformation) return res.status(400).json({message: "400: Error occured while adding frame information"});

        res.status(200).json(
            {
                frameId: frameInformation._id,
                message: "Frame is added successfully."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured"});
    }
}


exports.viewAllFrames = async (req, res, next) => {
    try {

        const viewAllFrames = await FrameModel.find({});

        if (!viewAllFrames || viewAllFrames.length <= 0) return res.status(404).json({message: "Frames does not exists."});

        res.status(200).json(viewAllFrames);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured in viewing all frames."});
    }
}


exports.viewParticularFrame = async (req, res, next) => {
    try {

        const frameId = req.params.frameId;

        const frameInformation = await FrameModel.findById({_id: frameId});

        if (!frameInformation || frameInformation.length <= 0) return res.status(400).json({message: "Frame does not exists."});

        res.status(200).send(frameInformation);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured in viewing particular frame."});
    }
}


exports.updateFrame = async (req, res, next) => {
    try {

        const frameId = req.params.frameId;

        const isFrameExists = await FrameModel.findById({_id: frameId});

        if (!isFrameExists || isFrameExists.length <= 0) return res.status(400).json({message: "Frame does not exists."});

        const {
            name, price, quantity, brand, type, category, subcategory, 
            shortDescription, detailedDescription,
            tags, frameMaterial, frameStyle, frameColor, frameSize
        } = req.body;

        const frameInformation = {
            name: name,
            price: price,
            quantity: quantity,
            brand: brand,
            type: type,
            category: category,
            subcategory: subcategory,
            shortDescription: shortDescription,
            detailedDescription: detailedDescription,
            tags: tags,
            frameMaterial: frameMaterial,
            frameStyle: frameStyle,
            frameColor: frameColor,
            frameSize: frameSize
        }

        const UpdatedFrameInformation = await FrameModel.findByIdAndUpdate(
            {_id: frameId},
            frameInformation,
            {new: true}
        );

        if (!UpdatedFrameInformation) return res.status(400).json({message: "400: Error occured while updating frame information."});

        res.status(200).json(UpdatedFrameInformation);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured in updating frame information"});
    }
}


exports.deleteFrame = async (req, res, next) => {
    try {

        const frameId = req.params.frameId;

        const isFrameExists = await FrameModel.findById(frameId);

        if (!isFrameExists || isFrameExists.length <= 0) return res.status(400).json({message: "Frame does not exists."});

        const deleteFrame = await FrameModel.findByIdAndDelete(frameId);

        if (!deleteFrame) return res.status(400).json({message: "error occured while deleting the frame"});

        res.status(204).json({message: "frame is removed successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured in removing frame information"});
    }
}

exports.uploadFrameProductImages = async (req, res, next) => {
    try {

        const {frameId} = req.params;

        if (!req.files) return res.status(400).json({message: "Error occured while uploading product image"});

        const result = Object.values(req.files).map(image_data => image_data[0].filename);

        const productImages = await FrameModel.findByIdAndUpdate({_id: frameId}, {$set: {images: result}}, {new: true});

        if (!productImages) return res.status(400).json({message: "Error occured while uploading image to db"});

        res.status(200).json({message: "Image uploaded successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while uploading frame images"});
    }
}

exports.deleteFrameProductImage = async (req, res, next) => {
    try {

        const frameId = res.locals.frameId;
        const imageId = req.params.imageId;

        const Images = await FrameModel.findById(frameId).select('images');

        if (Images && Images.images.indexOf(imageId) === -1) return res.status(400).json({message: "No images are present."});

        fs.unlinkSync('./public/uploads/products_images/' + imageId);

        const removeFromFrameDocs = await FrameModel.findByIdAndUpdate(frameId, {$pull: {images: imageId}});

        if (!removeFromFrameDocs) return res.status(400).json({message: "Error occured while removing image from db"});

        res.status(200).json({message: "Image is removed from successfully."});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while deleting frame images"});
    }
}







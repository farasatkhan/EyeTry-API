var GlassesModel = require('../../Products/v1/Glasses');

exports.addGlasses = async (req, res, next) => {
    try {

        const { 
            name, sku, description, short_description, price, discount, type, meta_title, meta_description, meta_keywords, manufacturer, framematerial, frame_size, lenswidth, lensheight, totalwidth, bridgewidth, templelength, is_multifocal, face_shape, gender, single_vision, reading, progressive, bifocal, frame, no_prescription, transition, is_low_stock, is_out_of_stock, is_in_stock, available_qty, quantity, categories, coupons, colors, images} = req.body;

        /* 
            The request contains various types of information. The text will be saved as it is, to store
            the images, the following requirements must be met:

            1. only png, jpeg are allowed.
            2. check for any viruses. (optional)
            2. take the image, create 3 versions of it for small, medium and larger screen.
        */

        const Glasses = await GlassesModel.create({

        });

        if (!Glasses) return res.status(400).json(
            {
                message: "400: Error occured while adding frame information"
            });

        res.status(200).json(
            {
                frameId: Glasses._id,
                message: "Frame is added successfully."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured when adding products."})
    }
}

exports.viewGlasses = async (req, res, next) => {

}

exports.updateGlasses = async (req, res, next) => {

}

exports.deleteGlasses = async (req, res, next) => {

}
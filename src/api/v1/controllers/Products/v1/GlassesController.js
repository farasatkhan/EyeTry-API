var GlassesModel = require('../../../models/Products/Glasses');

exports.addGlasses = async (req, res, next) => {
    try {

        const { 
            name, sku, description, short_description, price, discount, type, meta_title,
            meta_description, meta_keywords, manufacturer, frame_material, frame_size, lens_width, lens_height, total_width, bridge_width, temple_length, is_multifocal, face_shape, genders, single_vision, reading, progressive, bifocal, frame, no_prescription, transition, quantity, categories, coupons} = req.body;

        /* 
            The request contains various types of information. The text will be saved as it is, to store
            the images, the following requirements must be met:

            1. only png, jpeg are allowed.
            2. check for any viruses. (optional)
            2. take the image, create 3 versions of it for small, medium and larger screen.
        */

        const Glasses = await GlassesModel.create({
            name: name,
            sku: sku,
            description: description,
            short_description: short_description,
            price: price,
            discount: discount,
            type: type,
            meta: {
                title: meta_title,
                keywords: meta_keywords,
                description: meta_description,
            },
            manufacturer: manufacturer,
            frame_information: {
                frame_material: frame_material,
                frame_size: frame_size,
                colors: {}
            },
            lens_information: {
                lens_width: lens_width,
                lens_height: lens_height,
                total_width: total_width,
                bridge_width: bridge_width,
                temple_length: temple_length,
                is_multifocal: is_multifocal,
                single_vision: single_vision,
                reading: reading,
                progressive: progressive,
                bifocal: bifocal,
                frame: frame,
                no_prescription: no_prescription,
                transition: transition
            },
            person_information: {
                face_shape: face_shape,
                genders: genders
            },
            stock: {
                is_in_stock: true,
                quantity: quantity
            },
            categories: categories,
            coupons: coupons
        });

        if (!Glasses) return res.status(400).json(
            {
                message: "400: Error occured while adding frame information"
            });

        res.status(200).json(
            {
                GlassesId: Glasses._id,
                message: "Glasses are added successfully."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured when adding glasses."})
    }
}

exports.viewGlasses = async (req, res, next) => {
    res.status(200).json({message: "200: Success"})
}

exports.updateGlasses = async (req, res, next) => {
    res.status(200).json({message: "200: Success"})
}

exports.deleteGlasses = async (req, res, next) => {
    res.status(200).json({message: "200: Success"})
}
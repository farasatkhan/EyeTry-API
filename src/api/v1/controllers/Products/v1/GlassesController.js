var GlassesModel = require('../../../models/Products/Glasses.js');

exports.addGlasses = async (req, res, next) => {
    try {

        const { 
            name, sku, description, price, currency, discount, type, meta_title,
            meta_description, meta_keywords, manufacturer, frame_material, frame_size, lens_width, lens_height, total_width, bridge_width, temple_length, is_multifocal, face_shape, genders, quantity, categories, coupons, variants} = req.body;

        /* 
            The request contains various types of information. The text will be saved as it is, 

            variants will contains color, quantity.
            
            images. we have to create different sizes for the images. to store the images, the following requirements must be met:

            1. only png, jpeg are allowed.
            2. check for any viruses. (optional)
            3. take the image, create 3 versions of it for small, medium and larger screen.
            4. create variants using colors and images.

        */

        const Glasses = await GlassesModel.create({
            name: name,
            sku: sku,
            description: description,
            priceInfo: {
                price: price,
                currency: currency
            },
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
                frame_variants: []
            },
            lens_information: {
                lens_width: lens_width,
                lens_height: lens_height,
                total_width: total_width,
                bridge_width: bridge_width,
                temple_length: temple_length,
                is_multifocal: is_multifocal,
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
                message: "400: Error occured while adding glasses"
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
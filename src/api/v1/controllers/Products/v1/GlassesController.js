var GlassesModel = require('../../../models/Products/Glasses.js');

exports.addGlasses = async (req, res, next) => {
    try {

        const { 
            name, sku, description, price, currency, discount, type, categories, meta_title, meta_keywords,
            meta_description, manufacturer, frame_material, frame_size, measurement_type, lens_width, lens_height, total_width, 
            bridge_width, temple_length, is_multifocal, face_shape, genders, stock_status} = req.body;

        /* 
            The request contains various types of information. The text will be saved as it is, 

            variants will contains color, quantity.
            
            images. we have to create different sizes for the images. to store the images, the following requirements must be met:

            1. only png, jpeg are allowed.
            2. check for any viruses. (optional)
            3. take the image, create 3 versions of it for small, medium and larger screen.
            4. create variants using colors and images.

        */

        console.log("stock_status:", stock_status)

        const stock = (stock_status) => {
            if (stock_status === "in_stock") {
                return { is_in_stock: true }

            } else if (stock_status === "out_of_stock") {
                return { is_out_of_stock: true }

            } else if (stock_status === "to_be_announced") {
                return { is_to_be_announced: true }

            } else if (stock_status === "low_stock") {
                return { is_low_stock: true }
            }
        };

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
            categories: categories,
            meta: {
                title: meta_title,
                keywords: meta_keywords,
                description: meta_description,
            },
            manufacturer: manufacturer,
            frame_information: {
                frame_material: frame_material,
                frame_size: frame_size,
            },
            lens_information: {
                measurement_type: measurement_type,
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
            stock: stock(stock_status)
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
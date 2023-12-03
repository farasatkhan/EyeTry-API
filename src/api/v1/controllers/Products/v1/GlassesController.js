const sharp = require('sharp');
const path = require('path');
var { randomImageName } = require('../../../helpers/hashing');

var GlassesModel = require('../../../models/Products/Glasses.js');
var Review = require('../../../models/Products/Review.js');

exports.addGlasses = async (req, res, next) => {
    try {
        const { 
            name, sku, description, sku_model, frame_shape, rim_shape, price, currency, discount, type, categories, meta_title, meta_keywords,
            meta_description, manufacturer, frame_material, frame_size, measurement_type, lens_width, lens_height, total_width, 
            bridge_width, temple_length, is_multifocal, face_shape, genders, stock_status, frame_variants} = req.body;

        /* 
            The request contains various types of information. The text will be saved as it is, 

            variants will contains color, quantity.
            
            images. we have to create different sizes for the images. to store the images, the following requirements must be met:

            1. only png, jpeg are allowed.
            4. create variants using colors and images.

        */

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
            sku_model: sku_model,
            frame_shape: frame_shape,
            rim_shape: rim_shape,
            priceInfo: {
                price: price,
                currency: currency
            },
            discount: discount,
            type: type,
            categories: categories,
            meta: {
                meta_title: meta_title,
                meta_keywords: meta_keywords,
                meta_description: meta_description,
            },
            manufacturer: manufacturer,
            frame_information: {
                frame_material: frame_material,
                frame_size: frame_size,
                frame_variants: frame_variants
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

exports.viewGlassesList = async (req, res, next) => {
    try {
        const productList = await GlassesModel.find({}, {__v: 0}).sort({ _id: -1 });

        if (!productList) return res.status(400).json(
        {
            message: "400: Error occured while fetching glasses"
        });

        res.status(200).json(productList);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while fetching glasses"})
    }
}

exports.viewEyeglassesList = async (req, res, next) => {
    try {
        const productList = await GlassesModel.find({type: "Eyeglasses"}, {__v: 0}).sort({ _id: -1 });

        if (!productList) return res.status(400).json(
        {
            message: "400: Error occured while fetching glasses"
        });

        res.status(200).json(productList);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while fetching glasses"})
    }
}

exports.viewSunglassesList = async (req, res, next) => {
    try {
        const productList = await GlassesModel.find({type: "Sunglasses"}, {__v: 0}).sort({ _id: -1 });

        if (!productList) return res.status(400).json(
        {
            message: "400: Error occured while fetching glasses"
        });

        res.status(200).json(productList);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while fetching glasses"})
    }
}

exports.viewParticularGlasses = async (req, res, next) => {
    try {
        const glassesId = req.params.glassesId;

        const productList = await GlassesModel.findOne({_id: glassesId}, {__v: 0}).sort({ _id: -1 }).populate({
            path: 'reviewsInformation.user_reviews',
            model: Review,
            populate: {
                path: 'user',
                model: 'User'
            }
        });;

        if (!productList) return res.status(400).json(
        {
            message: "400: Error occured while fetching glasses"
        });

        res.status(200).json(productList);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while fetching glasses"})
    }
}

exports.updateGlasses = async (req, res, next) => {
    try {
        const glassesId = req.params.glassesId;

        const { 
            name, sku, description, price, sku_model, frame_shape, rim_shape, currency, discount, type, categories, meta_title, meta_keywords,
            meta_description, manufacturer, frame_material, frame_size, measurement_type, lens_width, lens_height, total_width, 
            bridge_width, temple_length, is_multifocal, face_shape, genders, stock_status, frame_variants} = req.body;


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

        const newUpdatedProductInformation = {
            name: name,
            sku: sku,
            description: description,
            sku_model: sku_model,
            frame_shape: frame_shape,
            rim_shape: rim_shape,
            priceInfo: {
                price: price,
                currency: currency
            },
            discount: discount,
            type: type,
            categories: categories,
            meta: {
                meta_title: meta_title,
                meta_keywords: meta_keywords,
                meta_description: meta_description,
            },
            manufacturer: manufacturer,
            frame_information: {
                frame_material: frame_material,
                frame_size: frame_size,
                frame_variants: frame_variants
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
        }

        const updatedProductInfo = await GlassesModel.findByIdAndUpdate(glassesId, newUpdatedProductInformation, {new: true});

        if (!updatedProductInfo) return res.status(400).json({message: "400: Error occured while updating product."});

        res.status(200).json({
            products: updatedProductInfo,
            message: "Information is updated successfully."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while updating products."});
    }
}

exports.deleteGlasses = async (req, res, next) => {
    const glassesId = req.params.glassesId;

    try {
        const deletedProduct = await GlassesModel.findByIdAndDelete(glassesId);
    
        if (!deletedProduct) {
          return res.status(404).json({ message: 'glasses not found' });
        }
    
        res.status(200).json({ message: 'glasses deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the glasses' });
      }
}

exports.addProductImages = async (req, res, next) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
          return res.status(400).json({ message: 'No files uploaded.' });
        }
    
        const filesLocation = [];

        const outputPath = './public/uploads/products/glasses/';
        
        for (const file of files) {
          const buffer = file.buffer;
          const outputFileName = randomImageName() + '.webp';
          const location = path.join(outputPath, outputFileName);

          const saveFileLocation = path.join('/uploads/products/glasses/', outputFileName);

          filesLocation.push(saveFileLocation);

          await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(location);
        }

        colors = req.body.color;
        color_code = req.body.color_code;
        quantities = req.body.quantity;
        imageCounts = req.body.image_count;

        const newFrameVariants = [];

        let imageIndex = 0;

        if (Array.isArray(colors)){

            if (typeof color_code === 'undefined') {
                color_code = "";
            }

            for (let i = 0; i < colors.length; i++) {
                const imgCount = imageCounts[i];
                const images = [];
    
                for (let j = 0; j < imgCount; j++) {
                    images.push(filesLocation[imageIndex]);
                    imageIndex++;
                }
    
                const variant = {
                    color: colors[i],
                    color_code: color_code[i],
                    quantity: quantities[i],
                    images: images
                }
    
                console.log(variant)
    
                newFrameVariants.push(variant);
            }
        } else {

            // if there is a single item
            const variant = {
                color: colors,
                color_code: color_code,
                quantity: quantities,
                images: filesLocation
            }

            newFrameVariants.push(variant);
        }

        console.log(newFrameVariants);
        
        const glassesId = req.params.glassesId;

        const updateFrameVaraints = await GlassesModel.findByIdAndUpdate(
            glassesId,
            { $set: { 'frame_information.frame_variants': newFrameVariants } },
            { new: true }
        );
    
        res.status(200).json({ 
            glasses: updateFrameVaraints,
            message: '200: Success'}
        );

      } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
}

exports.viewProductImages = async (req, res, next) => {
    res.status(200).json({message: "200: Success"})
}

exports.deleteProductImages = async (req, res, next) => {
    res.status(200).json({message: "200: Success"})
}


// user side glasses Apis
exports.viewNewArrivals = async (req, res, next) => {
    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1); // Calculate the date and time one hour ago
  
      const newArrivals = await GlassesModel.find(
        { 'createdAt': { $gte: oneHourAgo } },
        { __v: 0 }
      ).sort({ createdAt: -1 });
  
      if (!newArrivals) {
        return res.status(400).json({
          message: '400: Error occurred while fetching new arrivals',
        });
      }
  
      res.status(200).json(newArrivals);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: '500: Error occurred while fetching new arrivals' });
    }
}

exports.retrieveImage = async (req, res, next) => {
    const imageName = req.params.imageName;

    try {
        const imagePath = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'public', 'uploads', 'products', 'glasses', imageName);
        console.log(imagePath);
        res.sendFile(imagePath);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: '500: Error occured while retrieving image.'})
    }
}
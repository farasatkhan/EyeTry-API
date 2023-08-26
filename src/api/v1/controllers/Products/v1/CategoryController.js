var CategoryModel = require('../../../models/Products/Category.js');

exports.addCategory = async (req, res, next) => {
    try {
        const { category } = req.body;

        const Category = await CategoryModel.create({
            name: category
        });

        if (!Category) return res.status(400).json(
            {
                message: "400: Error occured while adding category"
            });

        res.status(200).json(
            {
                CategoryId: Category._id,
                message: "Category is added successfully."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured when adding category."})
    }
}

exports.viewCategory = async (req, res, next) => {
    try {

        const viewAllCategories = await CategoryModel.find({});

        if (!viewAllCategories || viewAllCategories.length <= 0) return res.status(404).json({message: "Categories does not exists."});

        res.status(200).json(viewAllCategories);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured in viewing categories."});
    }
}

exports.updateCategory = async (req, res, next) => {
    try {

        const categoryId = req.params.categoryId;

        const isCategoryExists = await CategoryModel.findById({_id: categoryId});

        if (!isCategoryExists || isCategoryExists.length <= 0) return res.status(400).json({message: "Category does not exists."});

        const { category } = req.body;

        const UpdatedCategoryInformation = await CategoryModel.findByIdAndUpdate(
            {_id: categoryId},
            {name: category},
            {new: true}
        );

        if (!UpdatedCategoryInformation) return res.status(400).json({message: "400: Error occured while updating category."});

        res.status(200).json(UpdatedCategoryInformation);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured in updating category"});
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;

        const isCategoryExists = await CategoryModel.findById(categoryId);

        if (!isCategoryExists || isCategoryExists.length <= 0) return res.status(400).json({message: "category does not exists."});

        const deleteCategory = await CategoryModel.findByIdAndDelete(categoryId);

        if (!deleteCategory) return res.status(400).json({message: "error occured while deleting the category"});

        res.status(204).json({message: "category is removed successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured in removing category"});
    }
}
const { asyncHandler } = require('../../../utils/asyncHandler.js');
const { ApiError } = require('../../../utils/ApiError');
const { ApiResponse } = require('../../../utils/ApiResponse.js');
const db = require('../../model.index.js');
const Category = db.spaceCategories;


// Create a new category or subcategory
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentId, status } = req.body;

  if (!name) {
    return ApiError(res, 400, "Category name is required.");
  }

  try {
    const newCategory = await Category.create({
      name,
      description,
      parentId: parentId || null, 
      status: status || 1, 
    });

    return ApiResponse(res, 201, "Category created successfully", newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    return ApiError(res, 500, "An error occurred while creating the category.");
  }
});

// Get all categories or subcategories
exports.getCategories = asyncHandler(async (req, res) => {
  const { parentId } = req.query;

  try {
    const categories = await Category.findAll({
      where: parentId ? { parentId } : { parentId: null }, 
    });

    return ApiResponse(res, 200, "Categories fetched successfully", categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ApiError(res, 500, "An error occurred while fetching categories.");
  }
});

// Update a category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, parentId, status } = req.body;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return ApiError(res, 404, "Category not found.");
    }

    await category.update({
      name: name || category.name,
      description: description || category.description,
      parentId: parentId !== undefined ? parentId : category.parentId,
      status: status !== undefined ? status : category.status,
    });

    return ApiResponse(res, 200, "Category updated successfully", category);
  } catch (error) {
    console.error("Error updating category:", error);
    return ApiError(res, 500, "An error occurred while updating the category.");
  }
});

// Delete a category or subcategory
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return ApiError(res, 404, "Category not found.");
    }

    await category.destroy();
    return ApiResponse(res, 200, "Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return ApiError(res, 500, "An error occurred while deleting the category.");
  }
});

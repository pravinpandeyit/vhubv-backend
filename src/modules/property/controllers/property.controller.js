const { asyncHandler } = require('../../../utils/asyncHandler.js');
const { ApiError } = require('../../../utils/ApiError');
const { ApiResponse } = require('../../../utils/ApiResponse.js');
const envConfig = require("../../../config/env.config.js");
const db = require('../../model.index.js');
const spaceCategories = db.spaceCategories;
const workspaceProperty = db.workspaceProperty;
const Op = db.Sequelize.Op;


// Function for add property
exports.addSpace = asyncHandler(async (req, res) => {

  const {
    categoryId,
    subcategoryId,
    type_of_establishment,
    name_of_establishment,
    ownership_of_property,
    city,
    complete_address,
    working_days,
    opening_time,
    internet_type,
    num_of_seats_available_for_coworking,
    pictures_of_the_space,
    first_name,
    last_name,
    mobile,
    email,
    latitude,
    longitude,
    area_in_sqft,
    cabins,
    current_occupancy_percentage

  } = req.body;

  // if (
  //   !categoryId ||
  //   !subcategoryId ||
  //   !type_of_establishment ||
  //   !name_of_establishment ||
  //   !ownership_of_property ||
  //   !city ||
  //   !complete_address ||
  //   !working_days ||
  //   !opening_time ||
  //   !internet_type ||
  //   !num_of_seats_available_for_coworking ||
  //   !first_name ||
  //   !last_name ||
  //   !mobile ||
  //   !email
  // ) {
  //   return ApiError(res, 400, "All required fields must be provided.");
  // }

  try {
    const category = await spaceCategories.findByPk(categoryId);
    const subcategory = await spaceCategories.findByPk(subcategoryId);

    if (!category || !subcategory || String(subcategory.parentId) !== String(categoryId)) {
      return ApiError(res, 400, "Invalid category or subcategory.");
    }

    const newSpace = await workspaceProperty.create({
      categoryId,
      subcategoryId,
      type_of_establishment,
      name_of_establishment,
      ownership_of_property,
      city,
      complete_address,
      working_days,
      opening_time,
      internet_type,
      num_of_seats_available_for_coworking,
      pictures_of_the_space,
      first_name,
      last_name,
      mobile,
      email,
      latitude,
      longitude,
      area_in_sqft,
      cabins,
      current_occupancy_percentage
    });

    return ApiResponse(res, 201, "Space added successfully", newSpace);
  } catch (error) {
    console.error("Error adding space:", error);
    return ApiError(res, 500, "An error occurred while adding the space.", error.message);
  }
});

// Function for property listing
exports.listProperties = async (req, res) => {
  try {
    const {
      type_of_establishment,
      city,
      status,
      internet_type,
      working_days,
      min_seats,
      max_seats,
      min_area,
      max_area,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    if (type_of_establishment) where.type_of_establishment = type_of_establishment;
    if (city) where.city = city;
    if (status !== undefined) where.status = status;
    if (internet_type) where.internet_type = internet_type;
    if (working_days) where.working_days = working_days;

    if (min_seats || max_seats) {
      where.num_of_seats_available_for_coworking = {};
      if (min_seats) where.num_of_seats_available_for_coworking[Op.gte] = parseInt(min_seats);
      if (max_seats) where.num_of_seats_available_for_coworking[Op.lte] = parseInt(max_seats);
    }

    if (min_area || max_area) {
      where.area_in_sqft = {};
      if (min_area) where.area_in_sqft[Op.gte] = parseInt(min_area);
      if (max_area) where.area_in_sqft[Op.lte] = parseInt(max_area);
    }

    if (search) {
      where[Op.or] = [
        { name_of_establishment: { [Op.iLike]: `%${search}%` } },
        { complete_address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await workspaceProperty.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Workspace properties fetched successfully",
      spaceList: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    });
} catch (error) {
  console.error("Property listing error:", error);
  return res.status(500).json({
    success: false,
    message: "Something went wrong while fetching properties",
  });
}
};




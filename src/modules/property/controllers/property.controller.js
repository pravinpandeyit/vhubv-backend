const { asyncHandler } = require('../../../utils/asyncHandler.js');
const { ApiError } = require('../../../utils/ApiError');
const { ApiResponse } = require('../../../utils/ApiResponse.js');
const envConfig = require("../../../config/env.config.js");
const db = require('../../model.index.js');
const Property = db.Property;
const Op = db.Sequelize.Op;


// Function for add property
exports.addProperty = asyncHandler(async (req, res) => {
  const {
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
  } = req.body;

  try {
    const newProperty = await Property.create({
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
    });

    return ApiResponse(res, 201, "Property added successfully", newProperty);
  } catch (err) {
    console.error("Error during property creation:", err);
    return ApiError(res, 500, "An error occurred while adding the property.", err.message);
  }
});



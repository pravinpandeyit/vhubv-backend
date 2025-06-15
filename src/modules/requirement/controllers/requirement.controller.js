const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { ApiError } = require("../../../utils/ApiError");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const db = require("../../model.index.js");
const { Op } = require("sequelize");
const Requirement = db.requirements;

// Add a new requirement
exports.addNewRequirement = asyncHandler(async (req, res) => {
  const { name, mobile, email, interested_in, company_name, team_size } =
    req.body;

  if (
    !name ||
    !mobile ||
    !email ||
    !interested_in ||
    !company_name ||
    !team_size
  ) {
    return ApiError(res, 400, "Please enter the required fields.");
  }

  try {
    const requirement = await Requirement.create({
      name,
      mobile,
      email,
      interested_in,
      company_name,
      team_size,
    });

    //send email function need to integrate later

    return ApiResponse(
      res,
      201,
      "Thank you for submitting the requirement, We will get back to you shortly"
    );
  } catch (error) {
    console.error("Error submitting requirement:", error);
    return ApiError(
      res,
      500,
      "An error occurred while submitting the requirement."
    );
  }
});

// Get all requirements
exports.getAllRequirements = asyncHandler(async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { mobile: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    const requirements = await Requirement.findAll({
      where: whereClause,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return ApiResponse(
      res,
      200,
      "Requirements fetched successfully",
      requirements
    );
  } catch (error) {
    console.error("Error fetching requirements:", error);
    return ApiError(res, 500, "An error occurred while fetching requirements.");
  }
});

//mark requirement as seen
exports.markRequirementAsSeen = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ApiError(res, 400, "Please enter the Enquiry ID!");
    }

    let requirement = await Requirement.findByPk(id);
    if (!requirement) {
      return ApiError(res, 400, "Requirement not found!");
    }

    if (requirement.is_seen === 1) {
      return ApiError(res, 400, "Requirement is already marked as seen!");
    }

    requirement.is_seen = 1;
    await requirement.save();
    return ApiResponse(res, 200, "Requirement marked as seen");
  } catch (error) {
    console.error("Error marking the requirement as seen:", error);
    return ApiError(
      res,
      500,
      "An error occurred while marking the requirement as seen."
    );
  }
});

//delete a requirement
exports.deleteRequirement = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ApiError(res, 400, "Please enter the Requirement ID!");
    }

    const requirement = await Requirement.findByPk(id);
    if (!requirement) {
      return ApiError(res, 400, "Requirement not found!");
    }

    await requirement.destroy();
    return ApiResponse(res, 200, "Requirement deleted successfully");
  } catch (error) {
    console.error("Error deleting the requirement:", error);
    return ApiError(
      res,
      500,
      "An error occurred while deleting the requirement"
    );
  }
});

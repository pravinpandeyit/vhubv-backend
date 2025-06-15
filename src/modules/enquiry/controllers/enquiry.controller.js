const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { ApiError } = require("../../../utils/ApiError");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const db = require("../../model.index.js");
const Enquiry = db.enquiries;
const { Op, where } = require("sequelize");

// Add a new enquiry
exports.addNewEnquiry = asyncHandler(async (req, res) => {
  const { name, mobile, email } = req.body;

  if (!name || !mobile || !email) {
    return ApiError(res, 400, "Please enter the required fields.");
  }

  try {
    const enquiry = await Enquiry.create({
      name,
      mobile,
      email,
    });

    //send email function need to integrate later

    return ApiResponse(
      res,
      201,
      "Thank you for submitting the enquiry, We will get back to you shortly",
      {
        name,
        mobile,
        email,
      }
    );
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return ApiError(
      res,
      500,
      "An error occurred while submitting the enquiry."
    );
  }
});

// Get a list of enquiries with optional search and seen status
exports.enquiryList = asyncHandler(async (req, res) => {
  try {
    const { search, seen } = req.query;
    const whereClause = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { mobile: { [Op.iLike]: `%${search}%` } },
        ],
      }),
      ...(seen && {
        is_seen: seen,
      }),
    };
    const enquiries = await Enquiry.findAll({
      where: whereClause,
      attributes: ["id", "name", "mobile", "email", "is_seen"],
    });
    return ApiResponse(res, 200, "Enquiries fetched successfully", enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return ApiError(res, 500, "An error occurred while fetching enquiries.");
  }
});

// Mark an enquiry as seen
exports.markEnquiryAsSeen = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ApiError(res, 400, "Please enter the Enquiry ID!");
    }

    let enquiry = await Enquiry.findByPk(id);
    if (!enquiry) {
      return ApiError(res, 400, "Enquiry not found!");
    }

    if (enquiry.is_seen === 1) {
      return ApiError(res, 400, "Enquiry is already marked as seen!");
    }

    enquiry.is_seen = 1;
    await enquiry.save();
    return ApiResponse(res, 200, "Enquiry marked as seen");
  } catch (error) {
    console.error("Error marking the enquiry as seen:", error);
    return ApiError(res, 500, "An error occurred while marking the enquiry as seen.");
  }
});

// Delete an enquiry
exports.deleteEnquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ApiError(res, 400, "Please enter the Enquiry ID!");
    }

    const enquiry = await Enquiry.findByPk(id);
    if (!enquiry) {
      return ApiError(res, 400, "Enquiry not found!");
    }

    await enquiry.destroy();
    return ApiResponse(res, 200, "Enquiry deleted successfully");
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return ApiError(res, 500, "An error occurred while deleting the enquiry.");
  }
});



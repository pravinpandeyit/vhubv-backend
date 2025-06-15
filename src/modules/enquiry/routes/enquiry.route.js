const router = require("express").Router();
const { verifyToken, isAdmin } = require("../../../middleware/authJwt");
const {
  addNewEnquiry,
  enquiryList,
  markEnquiryAsSeen,
  deleteEnquiry,
} = require("../controllers/enquiry.controller");

router.post("/enquiry/add", addNewEnquiry);
router.get("/enquiry/list", enquiryList);
router.patch("/enquiry/:id/mark-seen", verifyToken, isAdmin, markEnquiryAsSeen);
router.delete("/enquiry/:id/delete", deleteEnquiry);

module.exports = router;

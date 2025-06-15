const router = require("express").Router();
const { verifyToken, isAdmin } = require("../../../middleware/authJwt");
const {
  addNewEnquiry,
  enquiryList,
  markEnquiryAsSeen,
  deleteEnquiry,
} = require("../controllers/enquiry.controller");

router.post("/enquiry/add", addNewEnquiry);
router.get("/enquiry/list", verifyToken, isAdmin, enquiryList);
router.patch("/enquiry/:id/mark-seen", verifyToken, isAdmin, markEnquiryAsSeen);
router.delete("/enquiry/:id/delete", verifyToken, isAdmin, deleteEnquiry);

module.exports = router;

const router = require("express").Router();
const { verifyToken, isAdmin } = require("../../../middleware/authJwt");
const {
  addNewRequirement,
  getAllRequirements,
  markRequirementAsSeen,
  deleteRequirement,
} = require("../controllers/requirement.controller");

router.post("/requirement/add", addNewRequirement);
router.get("/requirement/list", verifyToken, isAdmin, getAllRequirements);
router.patch(
  "/requirement/:id/mark-seen",
  verifyToken,
  isAdmin,
  markRequirementAsSeen
);
router.delete(
  "/requirement/:id/delete",
  verifyToken,
  isAdmin,
  deleteRequirement
);

module.exports = router;

const router = require("express").Router();
const {addSpace,listProperties,listWorkspaces,addWorkspaceDayPass,addMeetingRoom,getWorkspaceDetails,addWorkspaceAmenities,addMasterAmenity,addPartnerSubmission } = require("../controllers/property.controller");
const {userRegistrationValidation,loginValidation} = require("../../../validations/auth.validation");
const { verifyToken, isAdmin,isProvider } = require('../../../middleware/authJwt')
const { uploadMultiple, handleMulterErrors,MultipleFileHandleMulterErrors } = require("../../../middleware/multerMiddleware");
const { MULTIPLE_FILE_SIZE_LIMIT,SINGLE_FILE_SIZE_LIMIT} = require("../../../config/env.config"); 



// auth routes
router.post("/add/property",verifyToken,uploadMultiple.single("pictures_of_the_space"),handleMulterErrors({maxSize:MULTIPLE_FILE_SIZE_LIMIT}), addSpace);
router.post("/add/partner",verifyToken,uploadMultiple.single("pictures_of_the_space"),handleMulterErrors({maxSize:MULTIPLE_FILE_SIZE_LIMIT}), addPartnerSubmission);
router.get("/property/list",verifyToken, listProperties);
router.get("/workspace/list",verifyToken, listWorkspaces);
router.post("/add/workspace/day-pass",verifyToken, addWorkspaceDayPass);
router.post("/add/workspace/meeting-room",verifyToken, addMeetingRoom);
router.get("/workspace/detail/:id",verifyToken, getWorkspaceDetails);
router.post("/admin/workspace/amenities",verifyToken, addWorkspaceAmenities);
router.post("/admin/amenity-master/add",verifyToken, addMasterAmenity);


module.exports = router;
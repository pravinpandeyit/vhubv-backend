const router = require("express").Router();
const {addProperty, } = require("../controllers/property.controller");
const {userRegistrationValidation,loginValidation} = require("../../../validations/auth.validation");
const { verifyToken, isAdmin,isProvider } = require('../../../middleware/authJwt')
const { uploadMultiple, handleMulterErrors,MultipleFileHandleMulterErrors } = require("../../../middleware/multerMiddleware");
const { MULTIPLE_FILE_SIZE_LIMIT,SINGLE_FILE_SIZE_LIMIT} = require("../../../config/env.config"); 



// auth routes
router.post("/add/property",verifyToken,uploadMultiple.single("pictures_of_the_space"),handleMulterErrors({maxSize:MULTIPLE_FILE_SIZE_LIMIT}), addProperty);


module.exports = router;
const router = require("express").Router();
const {verifyOtp ,sendOtp,userRegister,logIn,sendOtpForRegister,changePassword,logOut,deleteAccount } = require("../controllers/auth.controller");
const {userRegistrationValidation,loginValidation} = require("../../../validations/auth.validation");
const { verifyToken, isAdmin,isProvider } = require('../../../middleware/authJwt')
const { uploadMultiple, handleMulterErrors,MultipleFileHandleMulterErrors } = require("../../../middleware/multerMiddleware");
const { MULTIPLE_FILE_SIZE_LIMIT,SINGLE_FILE_SIZE_LIMIT} = require("../../../config/env.config"); 



// auth routes
router.post("/send-otp", sendOtp);
router.post("/register/send-otp", sendOtpForRegister);
router.post("/verify-otp", verifyOtp);
router.post("/register", [userRegistrationValidation], userRegister);

router.post("/login", [loginValidation], logIn);
router.post("/logout",verifyToken, logOut);
router.delete("/delete",verifyToken, deleteAccount);
router.post("/change-password",verifyToken, changePassword);


module.exports = router;
const jwt = require("jsonwebtoken");
const { asyncHandler } = require('../../../utils/asyncHandler.js');
const { ApiError } = require('../../../utils/ApiError');
const { ApiResponse } = require('../../../utils/ApiResponse.js');
const envConfig = require("../../../config/env.config.js");
const db = require('../../model.index.js');
const User = db.users;
const Careprovider = db.careproviders;
const ProviderCity = db.providerCity;
const ProviderState = db.providerState
const userPlan = db.userPlan
const emailHelper = require('../../../helpers/emailHelper.js');
const apiHelper = require("../../../helpers/apiHelper.js");
const { updateAndFind, uploadSingleImageToS3 } = require('../../../helpers/common.js');
const { sendNotification } = require('../../../helpers/fcmHelper.js');
const userNotification = db.notification;
const sequelize = apiHelper.getSequelize();
// const { findUser, updateUser, UserActivePlan } = require('../providers/user.provider.js');
const Op = db.Sequelize.Op;
const Plan = db.plan;
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const crypto = require("crypto");
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");
const fcmService = require('../../../helpers/fcmHelper.js');

// Set the required AWS S3 bucket configuration parameters:
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketURL = "https://" + bucketName + '.s3.' + bucketRegion + '.amazonaws.com/'

// Create an S3 client with the required credentials:
const s3 = new S3Client({
    credentials: { accessKeyId: accessKey, secretAccessKey: secretAccessKey },
    region: bucketRegion,
});

// Create a function to generate a random image name using crypto:
const randomImageName = (bytes = 8) =>
    crypto.randomBytes(bytes).toString("hex");
// Initialize Twilio client
const twilioClient = twilio(envConfig.TWILIO_ACCOUNT_SID, envConfig.TWILIO_AUTH_TOKEN);



// to function for send otp
exports.sendOtp = asyncHandler(async (req, res) => {
    try {
        const { email, user_type, login } = req.body;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        let user;
        let Data = {}
        if (isEmail) {
            user = await User.findOne({ where: { email } });
            Data.email = email
        } else {
            const normalizedMobile = email.replace(/\D/g, '');
            user = await findUser({ mobile: normalizedMobile })
            Data.mobile = email
        }

        if (!user) {
            return ApiError(res, 400, "This email Id is not registered with Careexchange.");
        }
        if (user && user?.user_type == 4) {
            return ApiError(res, 400, "Unauthorized Access: Admin accounts are not permitted to log in to the user/provider panel.");
        }
        if (user?.status == 4)
            return ApiError(res, 400, "Your account has been deleted. Please contact support to reactivate your account.");

        if (user?.status == 2)
            return ApiError(res, 400, "Your account is inactive. Please contact CareExchange support to reactivate your account.");

        // if (user.status == 0 && login && user.user_type !== '1') {
        //     return ApiError(res, 400, "Your account has not been approved yet. Please wait for administrator approval");
        // }
        const otp = Math.floor(1000 + Math.random() * 9000);
        Data.otp = otp;
        // const Data = { otp, email };
        // if (user_type) {
        //     Data.user_type = user_type
        // }
        Data.fullname = user?.fullname || '';
        if (user) {
            if (isEmail) {
                await User.update({ otp }, { where: { email: user.email } });
            } else {
                const normalizedMobile = user.mobile.replace(/\D/g, '');
                const update = await updateUser({ otp: otp, mobile: normalizedMobile })
                // await User.update({ otp }, { where: { mobile: user.mobile } });
            }
        } else {
            await User.create(Data);
        }

        // if (isEmail) {
        //     try {
        //         emailHelper.sendOtpEmail(Data);
        //     } catch (error) {
        //         console.log("Error sending email:", error);
        //         return ApiError(res, 500, "Something went wrong while sending the verification code via email.");
        //     }
        // } else {
        //     try {
        //         const normalizedMobile = email.replace(/\D/g, '');
        //         const message = await twilioClient.messages.create({
        //             body: `Your OTP for verification is: ${otp}`,
        //             from: envConfig.TWILIO_PHONE_NUMBER,
        //             to: normalizedMobile
        //         });
        //         console.log('OTP sent via SMS:', 'message.sid');
        //     } catch (smsError) {
        //         console.error("Error sending SMS:", smsError);

        //         // Handle Twilio trial account issue
        //         if (smsError.code === 21608) {
        //             return ApiError(res, 400, "This is a Twilio trial account. Please verify the phone number on Twilio before sending the OTP.");
        //         }
        //         return ApiError(res, 500, "Something went wrong while sending verification code via SMS.");
        //     }
        // }
        return ApiResponse(res, 200, "The verification code has been sent successfully.", { otp:otp });
    } catch (error) {
        console.error("Error during verification code process:", error);
        return ApiError(res, 500, "Something went wrong while processing the verification code request.", error);
    }
});

// to function for send otp for register
exports.sendOtpForRegister = asyncHandler(async (req, res) => {
    try {
        const { email, user_type } = req.body;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        let user;
        let Data = {}
        if (isEmail) {
            user = await User.findOne({ where: { email } });
            Data.email = email
        } else {
            user = await User.findOne({ where: { mobile: email } });
            Data.mobile = email
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        Data.otp = otp;
        Data.fullname = user?.fullname || '';
        // const Data = { otp, email };
        if (user_type) {
            Data.user_type = user_type
        }
        if (user?.status == 4)
            return ApiError(res, 400, "Your account has been deleted. Please contact support to reactivate your account.");


        if (user && user.fullname !== null) {
            return ApiError(res, 400, "Email is already registered. Please login.");
        } else {
            await User.create(Data);
        }

        if (isEmail) {
            try {
                emailHelper.sendOtpEmail(Data);
            } catch (error) {
                console.log("Error sending email:", error);
                return ApiError(res, 500, "Something went wrong while sending the verification code via email.");
            }
        } else {
            try {
                const message = await twilioClient.messages.create({
                    body: `Your OTP for verification is: ${otp}`,
                    from: envConfig.TWILIO_PHONE_NUMBER,
                    to: email
                });
                console.log('OTP sent via SMS:', 'message.sid');
            } catch (smsError) {
                console.error("Error sending SMS:", smsError);

                // Handle Twilio trial account issue
                if (smsError.code === 21608) {
                    return ApiError(res, 400, "This is a Twilio trial account. Please verify the phone number on Twilio before sending the OTP.");
                }
                return ApiError(res, 500, "Something went wrong while sending verification code via SMS.");
            }
        }
        return ApiResponse(res, 200, "The verification code has been sent successfully.", {  });
    } catch (error) {
        console.error("Error during OTP process:", error);
        return ApiError(res, 500, "Something went wrong while processing the verification code  request.");
    }
});

// to function for verify otp
exports.verifyOtp = asyncHandler(async (req, res) => {
    try {
        const { email, otp, device_id, username } = req.body;

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        let otpMatch;
        if (isEmail) {
            otpMatch = await User.findOne({
                where: {
                    otp,
                    email
                },
            });
        } else {
            otpMatch = await User.findOne({
                where: {
                    otp,
                    mobile: email
                },
            });
        }

        if (!otpMatch)
            return ApiError(res, 400, "The verification code you entered is incorrect, Please try again.");

        if (otpMatch.status == 3)
            return ApiError(res, 400, "Your account has been disabled by the administrator.");

        if (otpMatch?.status == 4)
            return ApiError(res, 400, "Your account has been deleted. Please contact support to reactivate your account.");

        if (otpMatch && otpMatch.user_type !== 4) {
            const saveUser = await updateAndFind(
                User,
                { otp: null, device_id: device_id },
                { where: { email: email } },
                ['userid', 'user_type', 'fullname', 'email']
            );

            const secretKey = envConfig.SECRET_JWT;
            let token = jwt.sign({ userid: otpMatch.userid.toString(), user_type: otpMatch.user_type }, secretKey, {
                expiresIn: 3600 * 24 * 365
            });
            otpMatch.dataValues.isSubscribed = (() => {
                const { user_type, plan_id } = otpMatch.dataValues;
                if (user_type == 1 || user_type == 4) {
                    return true;
                } else if (user_type == 2 || user_type == 3) {
                    return plan_id !== null;
                } else {
                    return false;
                }
            })();
            otpMatch.dataValues.provider_id = null
            if (otpMatch.user_type == 2 || otpMatch.user_type == 3) {
                let provider = await Careprovider.findOne({
                    where: {
                        userid: otpMatch.userid
                    },
                });

                if (provider) {
                    otpMatch.dataValues.provider_id = provider.id
                }
            }
            otpMatch.device_id = device_id
            if (username) {
                otpMatch.fullname = username
            }
            otpMatch.status = 1
            otpMatch.save();

            if (otpMatch) {
                otpMatch.dataValues.firstName = ''
                otpMatch.dataValues.lastName = ''
                if (username !== null && username !== undefined) {
                    const nameParts = username.split(" ");
                    const firstName = nameParts[0];
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : '';
                    otpMatch.dataValues.firstName = firstName
                    otpMatch.dataValues.lastName = lastName
                }

            }
            if (otpMatch?.status == 0) {
                return ApiResponse(res, 200, "Thank you for verifying your email! We will notify you as soon as your account is approved.", { user: otpMatch, token: token });
            } else {
                return ApiResponse(res, 200, "Logged in successfully.", { user: otpMatch, token: token });
            }
        } else {
            return ApiResponse(res, 200, "The verification code has been successfully verified.");
        }

    } catch (error) {
        console.error(error);
        return ApiResponse(res, 500, "Something went wrong while verifying the email, please try again", error);
    }
});

// to function for user register
exports.userRegister = asyncHandler(async (req, res) => {
  try {
    const { email, user_type,mobile, username, device_id, password } = req.body;
    const emailExist = await User.findOne({
      where: {
        email: email,
      },
    });

    if (emailExist) {
      return ApiError(res, 400, "This email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      user_type,
      fullname: username,
      email,
      device_id,
      password: hashedPassword,
      status: 1,
      mobile:mobile,
      created_date: new Date(),
    });

    const token = jwt.sign(
      {
        id: newUser.userid,
        email: newUser.email,
      },
      envConfig.SECRET_JWT,
      { expiresIn: "24h" }
    );

    return ApiResponse(res, 200, "User registered successfully", {
      user: {
        id: newUser.userid,
        username: newUser.fullname,
        email: newUser.email,
        user_type: newUser.user_type,
      },
      token,
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    return ApiError(
      res,
      500,
      "An error occurred during registration. Please try again later",
      err.message
    );
  }
});

// to function for login user
exports.logIn = asyncHandler(async (req, res) => {
    try {
        const { email, password, user_type, device_id } = req.body;
        
       const ExistUser = await User.findOne({ where: { email } });
        if (!ExistUser) {
            return ApiError(res, 400, "Invalid login credentials");
        }
        console.log(password, ExistUser.password);

        const isPasswordValid = await apiHelper.comparePasswords(password, ExistUser.password);

        if (!isPasswordValid) {
            return ApiError(res, 400, "Invalid Password");
        }

        if (ExistUser && ExistUser.status != 1) {
            return ApiError(res, 400, "Your account is not verify by Administrator Or Disabled");
        }
        
        const secretKey = envConfig.SECRET_JWT;
        let token = jwt.sign({ userid: ExistUser.userid.toString(), user_type: ExistUser.user_type }, secretKey, {
            expiresIn: '1y'
        });

        // ExistUser.dataValues.provider_id  = null
        // if (ExistUser.user_type == 2 || ExistUser.user_type == 3) {
        //     let provider = await Careprovider.findOne({
        //         where: {
        //             userid: ExistUser.userid
        //         },
        //     });

        //     if (provider) {
        //         ExistUser.dataValues.provider_id = provider.id
        //     }
        // }
        if(device_id){
            ExistUser.device_id = device_id;
        }
        await ExistUser.save();
        console.log('isPasswordValid',isPasswordValid);

        return ApiResponse(res, 200, "User login successfully", {
            user: {
                userid: ExistUser.userid,
                user_type: ExistUser.user_type,
                fullname: ExistUser.fullname,
                email: ExistUser.email,
                device_id: ExistUser.device_id
            },
            token
        });
    } catch (err) {
        console.error('Error during User login:', err);
        return ApiError(res, 500, "An error occurred during login. Please try again later", err.message);
    }
});

// to function for logout user
exports.logOut = asyncHandler(async (req, res) => {
    try {
        try {
            const userId = req.userId
            // const user = await User.update({},{
            //     where: {
            //         userid:userId
            //     },

            return ApiResponse(res, 200, "Logged out successfully");
        } catch (error) {
            res.status(500).json({ message: "An error occurred during logout", error: error.message });
        }
    } catch (err) {
        console.error('Error during User login:', err);
        return ApiError(res, 500, "An error occurred during login. Please try again later", err.message);
    }
});

// to function for delete account
exports.deleteAccount = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findOne({
            where: { userid: userId }
        });

        if (!user) {
            return ApiError(res, 404, "No user found");
        }

        user.status = 4;
        await user.save();

        return ApiResponse(res, 200, "Account deleted successfully");

    } catch (error) {
        console.error('Error during account delete:', error);
        return ApiError(res, 500, "An error occurred while deleting the account", error.message);
    }
});

// to function for check use has subscription
exports.deleteAccount = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findOne({
            where: { userid: userId }
        });

        if (!user) {
            return ApiError(res, 404, "No user found");
        }

        user.status = 4;
        await user.save();

        return ApiResponse(res, 200, "Account deleted successfully");

    } catch (error) {
        console.error('Error during account delete:', error);
        return ApiError(res, 500, "An error occurred while deleting the account", error.message);
    }
});


// Function for change password
exports.changePassword = asyncHandler(async (req, res) => {
    try {
        try {
            const userId = 255
            const { currentPassword, newPassword, confirmNewPassword } = req.body;

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                return ApiError(res, 400, 'All fields are required.');
            }
        
            if (newPassword !== confirmNewPassword) {
                return ApiError(res, 400, 'New passwords do not match.');
            }
        
            const user = await User.findOne({ where: { userid: userId } });
            if (!user) {
                return ApiError(res, 400, 'User not found.');
            }
        
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return ApiError(res, 400, 'Current password is incorrect.');
            }
        
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            console.log('req.body',hashedPassword);
        
            await User.update({ password: hashedPassword }, { where: { userid: userId } });
        
            return ApiResponse(res, 200, 'Password changed successfully.');

        } catch (error) {
            res.status(500).json({ message: "An error occurred during change password", error: error.message });
        }
    } catch (err) {
        console.error('Error during User login:', err);
        return ApiError(res, 500, "An error occurred during login. Please try again later", err.message);
    }
});
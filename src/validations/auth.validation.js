const { body, validationResult } = require('express-validator');
const apiHelper = require("../helpers/apiHelper");
const { ApiError } = require('../utils/ApiError');

const userRegistrationValidation = [
    body('user_type')
        // .optional() 
        .isIn(['1', '2','3','4']).withMessage('Invalid user type. Valid values are admin or user.'),

    body('username')
        .exists().withMessage('User name is required.')
        .isLength({ min: 1, max: 250 }).withMessage('Full name should be between 1 and 250 characters.')
        .trim(),

    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Email is not valid.')
        .trim(),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiError(res, 400, errors.array()[0].msg);
        }
        next();
    }
];

const loginValidation = [
    body('email')
        .exists().withMessage('email is required.')
        .isLength({ min: 4 })
        .withMessage("Please enter username or email ")
    ,
    body('user_type')
        .exists().withMessage('User type is required.')
        .isIn(['1', '2', '3','4']).withMessage('Invalid Source')
        .exists()
        .isLength({ min: 1, max: 1 }).withMessage('User type is Required')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiError(res, 400, errors.array()[0].msg);
        }
        next();
    }
];



const passwordValidation = [
    body('password')
        .exists().withMessage('Password is required.')
        .notEmpty().withMessage('Password cannot be empty.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .trim(),
    body('confirm_password')
        .exists().withMessage('Confirm password is required.')
        .notEmpty().withMessage('Confirm password cannot be empty.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        })
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiError(res, 400, errors.array()[0].msg);
        }
        next();
    }
];



module.exports = {
    userRegistrationValidation,
    loginValidation,
    passwordValidation
};

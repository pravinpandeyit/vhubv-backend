const { body, validationResult } = require('express-validator');
const { ApiError } = require('../utils/ApiError');

const serviceRequestValidation = [
    body('service_type')
        .exists().withMessage('Service type is required.')
        .notEmpty().withMessage('Service type cannot be empty.'),

    body('first_name')
        .exists().withMessage('First name is required.')
        .notEmpty().withMessage('First name cannot be empty.')
        .isString().withMessage('First name must be a string.')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long.')
        .trim(),

    body('last_name')
        .exists().withMessage('Last name is required.')
        .notEmpty().withMessage('Last name cannot be empty.')
        .isString().withMessage('Last name must be a string.')
        .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long.')
        .trim(),

    body('email_id')
        .exists().withMessage('Email is required.')
        .notEmpty().withMessage('Email cannot be empty.')
        .isEmail().withMessage('Email must be a valid email address.')
        .trim(),

    body('phone')
        .exists().withMessage('Phone number is required.')
        .notEmpty().withMessage('Phone number cannot be empty.')
        // .isMobilePhone().withMessage('Phone number must be valid.')
        .trim(),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string.')
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot be longer than 500 characters.'),

    body('fax')
        .optional()
        // .isString().withMessage('Fax must be a string.')
        .trim(),

    body('best_time_to_call')
        .optional()
        .exists().withMessage('Best time to call is required.')
        // .isString().withMessage('Best time to call must be a string.')
        .trim(),

    body('gender')
        .optional()
        .exists().withMessage('Gender is required.')
        .isIn(['M', 'F']).withMessage('Gender must be male, female'),

    body('age')
        .optional()
        .exists().withMessage('Age is required.')
        .isInt({ min: 0 }).withMessage('Age must be a valid integer and greater than 0.'),

    body('relationship')
        .optional()
        .exists().withMessage('Relationship is required.')
        .isString().withMessage('Relationship must be a string.')
        .trim(),

    body('address')
        .optional()
        .exists().withMessage('Address is required.')
        .notEmpty().withMessage('Address cannot be empty.')
        .isString().withMessage('Address must be a string.')
        .trim(),

    body('latitude')
        .optional()
        .exists().withMessage('Latitude is required.')
        .notEmpty().withMessage('Latitude cannot be empty.'),
    // .isFloat().withMessage('Latitude must be a valid number.'),

    body('longitude')
    .optional()
        .exists().withMessage('Longitude is required.')
        .notEmpty().withMessage('Longitude cannot be empty.'),
    // .isFloat().withMessage('Longitude must be a valid number.'),

    body('frequency')
    .optional()
        .exists().withMessage('Frequency is required.')
        // .optional()
        // .isString().withMessage('Frequency must be a string.')
        .trim(),

    body('start_date')
        .optional()
        .exists().withMessage('Start date is required.'),
    // .isISO8601().withMessage('Start date must be a valid date.'),

    body('days')
        .optional()
        .exists().withMessage('Days is required.'),

    // .isArray().withMessage('Days must be an array.'),

    body('start_time')
        .optional()
        .exists().withMessage('Start Time is required.')
        // .isString().withMessage('Start time must be a valid time string.')
        .trim(),

    body('end_time')
        .optional()
        .exists().withMessage('End Time is required.')
        // .isString().withMessage('End time must be a valid time string.')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiError(res, 400, errors.array()[0].msg);
        }
        next();
    }
];

module.exports = { serviceRequestValidation };

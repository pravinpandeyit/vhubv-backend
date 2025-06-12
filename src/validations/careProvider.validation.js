const { body, validationResult } = require('express-validator');
const { ApiError } = require('../utils/ApiError');

const postValidation = [
    body('care_provider_id')
       .optional()
        .exists().withMessage('Care provider ID is required.')
        .isInt({ gt: 0 }).withMessage('Care provider ID must be a positive integer.'),
    
    body('title')
        .exists().withMessage('Title is required.')
        .isString().withMessage('Title must be a string.')
        .trim()
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long.'),

    body('description')
        .exists().withMessage('Description is required.')
        .isString().withMessage('Description must be a string.')
        .trim()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),

    body('address')
        .exists().withMessage('Address is required.')
        .isString().withMessage('Address must be a string.')
        .trim()
        .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long.'),

    body('latitude')
        .exists().withMessage('Latitude is required.'),
        // .isFloat().withMessage('Latitude must be a valid float.'),

    body('longitude')
        .exists().withMessage('Longitude is required.'),
        // .isFloat().withMessage('Longitude must be a valid float.'),

    body('service_type')
        .exists().withMessage('Service type is required.')
        .isInt({ gt: 0 }).withMessage('Service type must be a valid integer.'),

    body('qulification_required')
        .exists().withMessage('Qualification is required.')
        .isString().withMessage('Qualification must be a string.'),

    body('pay_range')
        .exists().withMessage('Pay range is required.')
        .isInt({ gt: 0 }).withMessage('Pay range must be a valid positive integer.'),

    body('employee_benifits')
        .exists().withMessage('Employee benefits are required.')
        .isString().withMessage('Employee benefits must be a string.')
        .trim()
        .isLength({ max: 1000 }).withMessage('Employee benefits cannot exceed 1000 characters.'),

    body('contact_person_name')
        .exists().withMessage('Contact person name is required.')
        .isString().withMessage('Contact person name must be a string.')
        .trim(),

    body('contact_person_email')
        .exists().withMessage('Contact person email is required.')
        .isEmail().withMessage('Contact person email must be a valid email.'),

    body('contact_person_phone')
        .exists().withMessage('Contact person phone is required.')
        .isMobilePhone().withMessage('Contact person phone must be a valid phone number.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiError(res, 400, errors.array()[0].msg);
        }
        next();
    }
];

module.exports = { postValidation };

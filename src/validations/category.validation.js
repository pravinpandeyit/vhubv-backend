const { body, validationResult } = require('express-validator');
const { ApiError } = require('../utils/ApiError');

const categoryValidation = [
    body('name')
        .exists().withMessage('Category name is required.')
        .notEmpty().withMessage('Category name cannot be empty.')
        .isString().withMessage('Category name must be a string.')
        .trim()
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long.'),
    
    body('description')
        .exists().withMessage('Description is required.')
        .isString().withMessage('Description must be a string.')
        .trim()
        .isLength({ max: 255 }).withMessage('Description cannot be longer than 255 characters.'),
    
    body('parent_id')
        .optional()
        .custom(value => {
            if (value === null) return true; 
            if (Number.isInteger(parseInt(value, 10)) && parseInt(value, 10) >= 0) {
                return true; 
            }
            return ApiError(res, 400, 'Parent ID must be a valid integer or null.');
        })
        .toInt(), 
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiError(res, 400, errors.array()[0].msg);
        }
        next();
    }
];

module.exports = {categoryValidation};

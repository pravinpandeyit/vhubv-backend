const { body, validationResult } = require('express-validator');
const { ApiError } = require('../utils/ApiError');

const coopenValidation = [
    body('title')
        .exists().withMessage('Title is required.')
        .notEmpty().withMessage('Title cannot be empty.')
        .isString().withMessage('Title must be a string.')
        .trim()
        .isLength({ min: 2 }).withMessage('Title must be at least 2 characters long.'),

    body('description')
        .exists().withMessage('Description is required.')
        .isString().withMessage('Description must be a string.')
        .trim()
        .isLength({ max: 255 }).withMessage('Description cannot be longer than 255 characters.'),

    body('type')
        .exists().withMessage('Title is required.'),

    body('availableFor')
        .exists().withMessage('Available for is required.'),

    body('code')
        .exists().withMessage('Code is required.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiError(res, 400, errors.array()[0].msg);
        }
        next();
    }
];

module.exports = { coopenValidation };

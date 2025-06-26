import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { HttpException } from './error.middleware';

// Middleware to validate request data
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(new HttpException(400, firstError.msg as string));
  }
  
  next();
};

// Authentication validation rules
export const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .escape(),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string'),
  validate
];

export const refreshTokenValidation = [
  body('refreshToken')
    .trim()
    .notEmpty().withMessage('Refresh token is required')
    .isString().withMessage('Refresh token must be a string'),
  validate
];

// Project validation rules
export const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .escape(),
  body('image')
    .trim()
    .notEmpty().withMessage('Image is required')
    .isString().withMessage('Image must be a string')
    .escape(),
  body('link')
    .trim()
    .optional()
    .isURL().withMessage('Link must be a valid URL')
    .escape(),
  validate
];

export const updateProjectValidation = [
  param('id')
    .notEmpty().withMessage('Project ID is required')
    .isUUID().withMessage('Invalid project ID format'),
  body('title')
    .optional()
    .trim()
    .isString().withMessage('Title must be a string')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string')
    .escape(),
  body('image')
    .optional()
    .trim()
    .isString().withMessage('Image must be a string')
    .escape(),
  body('link')
    .optional()
    .trim()
    .isURL().withMessage('Link must be a valid URL')
    .escape(),
  validate
];

// Service validation rules
export const createServiceValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .escape(),
  body('price')
    .trim()
    .notEmpty().withMessage('Price is required')
    .isString().withMessage('Price must be a string')
    .escape(),
  body('duration')
    .trim()
    .notEmpty().withMessage('Duration is required')
    .isString().withMessage('Duration must be a string')
    .escape(),
  body('features')
    .optional()
    .isArray().withMessage('Features must be an array')
    .custom((features) => {
      if (!features) return true;
      
      if (!Array.isArray(features)) {
        throw new Error('Features must be an array');
      }
      
      for (const feature of features) {
        if (typeof feature !== 'string') {
          throw new Error('Each feature must be a string');
        }
      }
      
      return true;
    }),
  validate
];

export const updateServiceValidation = [
  param('id')
    .notEmpty().withMessage('Service ID is required')
    .isUUID().withMessage('Invalid service ID format'),
  body('title')
    .optional()
    .trim()
    .isString().withMessage('Title must be a string')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string')
    .escape(),
  body('price')
    .optional()
    .trim()
    .isString().withMessage('Price must be a string')
    .escape(),
  body('duration')
    .optional()
    .trim()
    .isString().withMessage('Duration must be a string')
    .escape(),
  body('features')
    .optional()
    .isArray().withMessage('Features must be an array')
    .custom((features) => {
      if (!features) return true;
      
      if (!Array.isArray(features)) {
        throw new Error('Features must be an array');
      }
      
      for (const feature of features) {
        if (typeof feature !== 'string') {
          throw new Error('Each feature must be a string');
        }
      }
      
      return true;
    }),
  validate
];

// Message validation rules
export const createMessageValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isString().withMessage('Phone must be a string')
    .escape(),
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isString().withMessage('Type must be a string')
    .escape(),
  body('budget')
    .trim()
    .notEmpty().withMessage('Budget is required')
    .isString().withMessage('Budget must be a string')
    .escape(),
  body('detail')
    .trim()
    .notEmpty().withMessage('Detail is required')
    .isString().withMessage('Detail must be a string')
    .escape(),
  validate
];

// Contact info validation rules
export const contactInfoValidation = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isString().withMessage('Phone must be a string')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isString().withMessage('Address must be a string')
    .escape(),
  body('map')
    .optional()
    .trim()
    .isString().withMessage('Map must be a string')
    .escape(),
  body('instagram')
    .optional()
    .trim()
    .isString().withMessage('Instagram handle must be a string')
    .escape(),
  body('whatsApp')
    .optional()
    .trim()
    .isString().withMessage('WhatsApp number must be a string')
    .escape(),
  validate
];

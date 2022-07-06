'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { query, body, param, validationResult } from 'express-validator';

const subscriptionQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for subscriptions.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for subscriptions.')
];

const subscriptionPostBodyValidation = [
  body('userId').isNumeric().withMessage('Must provide a valid userId.')
];

const subscriptionStatusQueryValidation = [
  query('userId').isString().withMessage('Must provide a valid userId.')
];

const subscriptionPutBodyValidation = [
  body('startDate')
    .isString()
    .withMessage('Must provide a valid startDate for subscription.'),
  body('userId').isNumeric().withMessage('Must provide a valid userId.')
];

export {
  validationResult,
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionPutBodyValidation,
  subscriptionStatusQueryValidation
};

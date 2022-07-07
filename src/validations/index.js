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

const subscriptionIdParamValidation = [
  param('subscriptionId')
    .isString()
    .withMessage('Must provide a existing subscription id.')
];

const subscriptionPostBodyValidation = [
  body('userId').isNumeric().withMessage('Must provide a valid userId.'),
  body('email')
    .isString()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.'),
  body('username')
    .isString()
    .withMessage('Must provide your first and last name.'),
  body('recurring')
    .isString()
    .withMessage('Must provide the cadence of reoccurance.')
];

const subscriptionStatusQueryValidation = [
  query('subscriptionId')
    .isString()
    .withMessage('Must provide a existing subscription id.')
];

export {
  validationResult,
  subscriptionIdParamValidation,
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionStatusQueryValidation
};

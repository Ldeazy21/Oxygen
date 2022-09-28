'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { query, body, param, validationResult } from 'express-validator';
import { RECURRING_TYPES, SUBSCRIPTION_TYPES } from '../constants';

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
    .custom(recurring => {
      if (!RECURRING_TYPES.includes(recurring)) {
        throw new Error('Cadence submitted is not allowed for this field.');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
  body('type')
    .isString()
    .custom(type => {
      if (!SUBSCRIPTION_TYPES.includes(type)) {
        throw new Error('Type submitted is not allowed for this field.');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
];

const subscriptionStatusQueryValidation = [
  query('subscriptionId')
    .isString()
    .withMessage('Must provide a existing subscription id.')
];

const subscriptionUpdateBodyValidation = [
  body('subscriptionId')
    .isString()
    .withMessage('Must provide a existing subscription id.'),
  body('recurring')
    .isString()
    .withMessage('Must provide a valid recurring schedule of subscription.')
];

export {
  validationResult,
  subscriptionIdParamValidation,
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionStatusQueryValidation,
  subscriptionUpdateBodyValidation
};

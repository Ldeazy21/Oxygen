import express from 'express';

const { Router } = express;
import { SubscriptionController } from '../controllers';
import {
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionStatusQueryValidation,
  subscriptionIdParamValidation,
  subscriptionUpdateBodyValidation
} from '../validations';
import { validationHandler } from '../middlewares';

const router = Router();

router.get(
  '/subscription-service/getSubscriptions',
  subscriptionQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptions
);

router.get(
  '/subscription-service/getSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.getSubscription
);

router.get(
  '/subscription-service/getSubscriptionStatus',
  subscriptionStatusQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptionStatus
);
router.get(
  '/subscription-service/getMyVidSubscription',
  subscriptionStatusQueryValidation,
  validationHandler,
  SubscriptionController.getMyVidSubscription
);

router.post(
  '/subscription-service/createSubscription',
  subscriptionPostBodyValidation,
  validationHandler,
  SubscriptionController.createSubscription
);

router.put(
  '/subscription-service/updateSubscription',
  subscriptionUpdateBodyValidation,
  validationHandler,
  SubscriptionController.updateSubscription
);

//TODO: Add endpoint for update subscription with recurring field and endDate

export default router;

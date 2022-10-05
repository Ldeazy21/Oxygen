import express from 'express';

const { Router } = express;
import { IssueSubscriptionController } from '../controllers';

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
  '/subscription-service/getIssueSubscriptions',
  // subscriptionQueryValidation,
  // validationHandler,
  IssueSubscriptionController.getSubscriptions
);

router.get(
  '/subscription-service/getIssueSubscription/',
  IssueSubscriptionController.getSubscription
);

// router.get(
//   '/subscription-service/getIssueSubscriptionStatus',
//   IssueSubscriptionController.getSubscriptionStatus
// );

router.post(
  '/subscription-service/createIssueSubscription',
  IssueSubscriptionController.createIssueSubscription
);

router.put(
  '/subscription-service/updateIssueSubscription',
  IssueSubscriptionController.updateIssueSubscription
);
router.put(
  '/subscription-service/addIssueToSubscription',
  IssueSubscriptionController.addIssueToSubscription
);
router.put(
  '/subscription-service/addBundleToSubscription',
  IssueSubscriptionController.addBundleToSubscription
);
//TODO: Add endpoint for update subscription with recurring field and endDate

export default router;

'use strict';

import { IssueSubscriptionService } from '../services';

exports.getSubscriptions = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] =
      await IssueSubscriptionService.getIssuseSubscriptions(query);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting subscriptions: `, err);
    next(err);
  }
};

exports.getSubscription = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log('subscriptionId:xxxxxs ', userId);
    const [statusCode, response] =
      await IssueSubscriptionService.getIssueSubscription(userId);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting subscription by id:xyxyxyxy`, err);
    next(err);
  }
};

exports.createIssueSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] =
      await IssueSubscriptionService.createIssueSubscription(body);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with creating subscription: `, err);
    next(err);
  }
};

exports.updateIssueSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] =
      await IssueSubscriptionService.updateIssueSubscription(body);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating subscription: `, err);
    next(err);
  }
};

exports.addIssueToSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] =
      await IssueSubscriptionService.addIssueToSubscription(body);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating subscription: `, err);
    next(err);
  }
};
exports.addBundleToSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] =
      await IssueSubscriptionService.addBundleToSubscription(body);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating subscription: `, err);
    next(err);
  }
};

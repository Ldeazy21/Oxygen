import {
  getIssuSubscriptions,
  getIssueSubscription,
  createIssueSubscription,
  updateIssueSubscription,
  addBundleToSubscription,
  addIssueToSubscription
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getIssuseSubscriptions = async query => {
  try {
    const subscriptions = await getIssuSubscriptions(query);
    if (subscriptions) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with query params.',
          subscriptions
        }
      ];
    }
    return badRequest(`No subscriptions found with selected query params.`);
  } catch (err) {
    console.log('Error getting all subscriptions: ', err);
    return badImplementationRequest('Error getting subscriptions.');
  }
};

exports.getIssueSubscription = async subscriptionId => {
  try {
    console.log('in getIssueSubscription file services');
    const subscription = await getIssueSubscription(subscriptionId);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with id`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.createIssueSubscription = async body => {
  try {
    const subscription = await createIssueSubscription(body);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with id: ${subscriptionId}.`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.updateIssueSubscription = async payload => {
  try {
    const subscription = await updateIssueSubscription(payload);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with id: ${subscriptionId}.`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.addIssueToSubscription = async payload => {
  try {
    const subscription = await addIssueToSubscription(payload);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with id.`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.addBundleToSubscription = async payload => {
  try {
    const subscription = await addBundleToSubscription(payload);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with id: ${subscriptionId}.`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

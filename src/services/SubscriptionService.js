import {
  getSubscriptions,
  createSubscription,
  getSubscriptionStatus,
  getSubscription,
  deleteSubscription
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getSubscriptions = async query => {
  try {
    const subscriptions = await getSubscriptions(query);
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

exports.getSubscription = async subscriptionId => {
  try {
    const subscription = await getSubscription(subscriptionId);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.getSubscriptionStatus = async query => {
  try {
    const [message] = await getSubscriptionStatus(query);
    if (message) {
      return [
        200,
        {
          subscriptionStatus: message
        }
      ];
    }
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.createSubscription = async payload => {
  try {
    const [error, subscription] = await createSubscription(payload);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful creation of subscription.',
          subscription
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error creating subscription: ', err);
    return badImplementationRequest('Error creating subscription.');
  }
};

exports.deleteSubscription = async subscriptionId => {
  try {
    const subscription = await getSubscription(subscriptionId);
    if (subscription) {
      const deletedSubscription = await deleteSubscription(subscriptionId);
      if (deletedSubscription) {
        return [204];
      }
    }
    return badRequest(`No subscription found with id provided.`);
  } catch (err) {
    console.log('Error deleting subscription by id: ', err);
    return badImplementationRequest('Error deleting subscription by id.');
  }
};

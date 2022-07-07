'use strict';

import config from '../config';
import models from '../models';
import {
  createMoment,
  getSubscriptionStartDate,
  getSubscriptionEndDate,
  createFormattedDate
} from '../utilities';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

export const getSubscriptions = async query => {
  try {
    const { Subscription } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;
    return await Subscription.find({ ...query }, queryOps)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .sort({ endDate: 'asc' })
      .exec();
  } catch (err) {
    console.log('Error getting subscriptions data from db: ', err);
  }
};

export const getSubscription = async subscriptionId => {
  try {
    const { Subscription } = models;
    const subscription = await Subscription.findOne({ subscriptionId });
    return subscription;
  } catch (err) {
    console.log('Error getting subscription data from db by id: ', err);
  }
};

export const createSubscription = async payload => {
  try {
    const { Subscription } = models;
    const { userId, type } = payload;
    const subscriptions = await Subscription.find({
      userId,
      type
    })
      .sort({
        endDate: 'desc'
      })
      .limit(1);
    if (!subscriptions.length) {
      const body = {
        ...payload,
        startDate: payload.startDate
          ? createFormattedDate(payload.startDate)
          : getSubscriptionStartDate(),
        endDate: payload.endDate
          ? createFormattedDate(payload.endDate)
          : getSubscriptionEndDate(),
        purchaseDate: payload.purchaseDate
          ? createFormattedDate(payload.purchaseDate)
          : getSubscriptionStartDate()
      };

      const subscription = new Subscription(body);
      const createdSubscription = await subscription.save();
      const {
        startDate,
        endDate,
        type,
        purchaseDate,
        amount,
        userId,
        subscriptionId
      } = createdSubscription;
      return [
        null,
        {
          startDate,
          endDate,
          type,
          purchaseDate,
          amount,
          userId,
          subscriptionId
        }
      ];
    }
    return [new Error('Subscription is still active for the current year')];
  } catch (err) {
    console.log('Error saving subscription data to db: ', err);
  }
};

export const updateSubscription = async payload => {
  try {
    const { Subscription } = models;
    const { userId, startDate, type } = payload;
    const subscriptions = await Subscription.find({
      userId,
      type
    })
      .sort({
        endDate: 'desc'
      })
      .limit(1);

    if (subscriptions) {
      const subscription = subscriptions[0];
      const filter = { subscriptionId: subscription.subscriptionId };
      const options = { upsert: true, new: true };
      const update = {
        ...payload,
        endDate: getSubscriptionEndDate(startDate)
      };
      const updatedSubscription = await Subscription.findOneAndUpdate(
        filter,
        update,
        options
      );
      return [null, updatedSubscription];
    }
    return [new Error('No subscriptions to update')];
  } catch (err) {
    console.log('Error updating subscription data to db: ', err);
  }
};

export const getSubscriptionStatus = async query => {
  try {
    const { Subscription } = models;
    const { userId, type } = query;
    const subscriptions = await Subscription.find({
      userId,
      type
    })
      .sort({
        endDate: 'desc'
      })
      .limit(1);
    if (subscriptions.length) {
      const subscription = subscriptions[0];
      const endDate = createMoment(subscription.endDate);
      const currentDate = createMoment();
      const diffInMonths = endDate.diff(currentDate, 'months');
      if (Math.sign(diffInMonths) > 0) {
        return [`Subscription ends in ${diffInMonths} months.`];
      } else {
        return [`Subscription expired ${diffInMonths} months ago.`];
      }
    }
    return [''];
  } catch (err) {
    console.log('Error getting subscription data to db: ', err);
  }
};

export const deleteSubscription = async subscriptionId => {
  try {
    const { Subscription } = models;
    const deletedSubscription = await Subscription.deleteOne({
      subscriptionId
    });
    return deletedSubscription;
  } catch (err) {
    console.log('Error deleting subscription by id: ', err);
  }
};

'use strict';

import config from '../config';
import models from '../models';
import {
  createMoment,
  getSubscriptionStartDate,
  getSubscriptionEndDate,
  capitalizeFirstLetter
} from '../utilities';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  // return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  return 'mongodb+srv://sheen:sheenPW1@cluster0.2sgamix.mongodb.net/test?retryWrites=true&w=majority';
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

export const getMyVidSubscription = async query => {
  try {
    const { Subscription } = models;
    const subscription = await Subscription.findOne({ query });
    return subscription;
  } catch (err) {
    console.log('Error getting subscription data from db by id: ', err);
  }
};

export const createSubscription = async payload => {
  try {
    const { Subscription } = models;
    const { userId, type, recurring } = payload;
    const subscription = await Subscription.findOne({
      userId,
      type,
      recurring
    });
    if (subscription) {
      const endDate = createMoment(subscription.endDate);
      const currentDate = createMoment();
      const diffInMonths = endDate.diff(currentDate, 'months');
      if (recurring === 'monthly' && Math.sign(diffInMonths) > 0) {
        return [
          new Error(
            `${capitalizeFirstLetter(
              type
            )} subscription is still active for the current month.`
          )
        ];
      }
      if (recurring === 'yearly' && Math.sign(diffInMonths) < 12) {
        return [
          new Error(
            `${capitalizeFirstLetter(
              type
            )} subscription is still active for the current year.`
          )
        ];
      }
    }
    const body = {
      ...payload,
      startDate: getSubscriptionStartDate(),
      endDate: getSubscriptionEndDate(recurring),
      purchaseDate: getSubscriptionStartDate()
    };

    const newSubscription = new Subscription(body);
    const createdSubscription = await newSubscription.save();
    return [null, createdSubscription];
  } catch (err) {
    console.log('Error saving subscription data to db: ', err);
  }
};

export const getSubscriptionStatus = async query => {
  try {
    const { Subscription } = models;
    const { subscriptionId } = query;
    const subscription = await Subscription.findOne({ subscriptionId });
    if (subscription) {
      const endDate = createMoment(subscription.endDate);
      const currentDate = createMoment();
      const diffInMonths = endDate.diff(currentDate, 'months');
      const diffInWeeks = endDate.diff(currentDate, 'weeks');
      if (Math.sign(diffInMonths) > 0) {
        return [`Subscription ends in ${diffInMonths} months.`];
      }
      if (Math.sign(diffInMonths) === 0) {
        return [`Subscription ends in ${diffInWeeks} weeks.`];
      } else {
        return [`Subscription expired ${diffInMonths} months ago.`];
      }
    }
    return [''];
  } catch (err) {
    console.log('Error getting subscription data to db: ', err);
  }
};

export const updateSubscription = async payload => {
  try {
    const { Subscription } = models;
    const { subscriptionId, recurring } = payload;
    const filter = { subscriptionId };
    const options = { upsert: true, new: true };
    const update = { ...payload, endDate: getSubscriptionEndDate(recurring) };

    const updatedSubscription = await Subscription.findOneAndUpdate(
      filter,
      update,
      options
    );
    if (updatedSubscription) {
      return [null, updatedSubscription];
    }
    return [new Error('Unable to update subscription.')];
  } catch (err) {
    console.log('Error updating issue data to db: ', err);
  }
};

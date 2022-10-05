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
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  // return 'mongodb+srv://sheen:sheenPW1@cluster0.2sgamix.mongodb.net/test?retryWrites=true&w=majority';
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
    console.log('subscription: ', subscription);
    if (subscription) {
      const endDate = createMoment(subscription.endDate);
      const currentDate = createMoment();
      const diffInMonths = endDate.diff(currentDate, 'months');
      console.log('diffInMonths: ', diffInMonths);
      if (recurring === 'monthly' && Math.sign(diffInMonths) >= 0) {
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

export const getIssuSubscriptions = async query => {
  try {
    const { IssueSubscription } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;
    return await IssueSubscription.find({ ...query }, queryOps)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .sort({ endDate: 'asc' })
      .exec();
  } catch (err) {
    console.log('Error getting IssueSubscription data from db: ', err);
  }
};

export const getIssueSubscription = async userId => {
  try {
    const { IssueSubscription } = models;
    const subscription = await IssueSubscription.findOne({ userId: userId });
    return subscription;
  } catch (err) {
    console.log('Error getting IssueSubscription data from db by id: ', err);
  }
};

export const createIssueSubscription = async payload => {
  try {
    const { IssueSubscription } = models;
    const { userId, bundle } = payload;
    const subscription = await IssueSubscription.findOne({
      userId
    });

    if (subscription) {
      return [
        new Error(
          `${capitalizeFirstLetter(
            type
          )} subscription is still active for the current year.`
        )
      ];
    } else {
      const newBundle = {
        ...bundle,
        startDate: getSubscriptionStartDate(),
        endDate: getSubscriptionStartDate()
      };
      const body = {
        ...payload,
        bundle: newBundle
      };

      const newSubscription = new IssueSubscription(body);
      const createdSubscription = await newSubscription.save();
      return [createdSubscription];
    }
  } catch (err) {
    console.log('Error saving IssueSubscription data to db: ', err);
  }
};

export const updateIssueSubscription = async payload => {
  try {
    const { IssueSubscription } = models;
    const { userId } = payload;
    const filter = { userId };
    const options = { upsert: true, new: false };
    const update = { ...payload };

    const updatedSubscription = await IssueSubscription.findOneAndUpdate(
      filter,
      update,
      options
    );
    if (updatedSubscription) {
      return [null, updatedSubscription];
    }
    return [new Error('Unable to update IssueSubscription.')];
  } catch (err) {
    console.log('Error updating IssueSubscription data to db: ', err);
  }
};

export const addIssueToSubscription = async payload => {
  try {
    const { IssueSubscription } = models;
    const { userId, issue } = payload;
    const filter = { userId };
    const options = { upsert: true, new: false };
    // push issue to issues array mongoose
    const update = {
      $push: { myisssues: issue },
      $inc: { 'bundle.left': -1 }
    };
    // $push: { 'myisssues': issue, 'bundle.left': { $inc: 1 } }
    // z

    const updatedSubscription = await IssueSubscription.findOneAndUpdate(
      filter,
      update,
      options
    );
    if (updatedSubscription) {
      return [null, updatedSubscription];
    }
    return [new Error('Unable to update IssueSubscription.')];
  } catch (err) {
    console.log('Error updating IssueSubscription data to db: ', err);
  }
};

export const addBundleToSubscription = async payload => {
  try {
    const { IssueSubscription } = models;
    const { userId, issue } = payload;
    const filter = { userId };
    const options = { upsert: true, new: false };
    // push issue to issues array mongoose
    const update = {
      bundle: {
        status: true,
        left: 6,
        startDate: getSubscriptionStartDate(),
        endDate: getSubscriptionEndDate('yearly')
      }
    };

    const updatedSubscription = await IssueSubscription.findOneAndUpdate(
      filter,
      update,
      options
    );
    if (updatedSubscription) {
      return [null, updatedSubscription];
    }
    return [new Error('Unable to update IssueSubscription.')];
  } catch (err) {
    console.log('Error updating IssueSubscription data to db: ', err);
  }
};

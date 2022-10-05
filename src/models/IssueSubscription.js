'use strict';

import mongoose from 'mongoose';
import config from '../config';
import { createSubscriptionId } from '../utilities';

const { Schema } = mongoose;
const { NODE_ENV } = config;

import { SUBSCRIPTION_TYPES, RECURRING_TYPES } from '../constants';

// issueSUBSCRIPTION SCHEMA
//  ============================================
const IssueSubscriptionSchema = new Schema({
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  bundle: { type: Object },
  myisssues: { type: Array }
});

/**
 * Set the autoCreate option on models if not on production
 */

IssueSubscriptionSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create Subscription model out of subscriptionSchema
 */
const IssueSubscription = mongoose.model(
  'IssueSubscription',
  IssueSubscriptionSchema
);

export default IssueSubscription;

'use strict';

import express from 'express';
import { cache } from '../middlewares';
import { fancyTimeFormat } from '../utilities';

const { Router } = express;

const router = Router();

const { version } = require('../../package.json');

router.get('/subscription-service/', cache(), (_, res) => {
  res
    .status(200)
    .send({ message: 'Welcome to Oxygen Subscription Manager Service!' });
});

router.get('/subscription-service/probeCheck', (_, res) => {
  res.status(200).send({
    uptime: fancyTimeFormat(process.uptime()),
    date: new Date(),
    message: 'Oxygen Subscription Manager service up and running!',
    appVersion: version
  });
});

export default router;

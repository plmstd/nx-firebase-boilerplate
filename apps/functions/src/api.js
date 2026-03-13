import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import express from 'express';
import cors from 'cors';
import { logger } from '@myapp/backend';

// set global options
setGlobalOptions({ region: 'europe-west1' });

// init app
const app = express();

// init cors
app.use(cors());

// test route
app.get('/test', (req, res) => {
  logger.info('Hello from firebase logger');
  res.send('Hello World');
});

// 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

export const api = onRequest(
  {
    secrets: ['FB_ADMIN_SERVICE'],
    timeoutSeconds: 60 * 1, // 1 minute,
  },
  app,
);

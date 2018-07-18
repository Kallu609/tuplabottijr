import * as dotenv from 'dotenv';
dotenv.config();
process.env.NTBA_FIX_319 = '1'; // Gets rid of node-telegram-bot console nag

import Bot from './Bot';

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

new Bot();
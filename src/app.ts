import * as dotenv from 'dotenv';
dotenv.config();
process.env.NTBA_FIX_319 = '1';

import Bot from './Bot';
new Bot();
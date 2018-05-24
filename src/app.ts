import * as dotenv from 'dotenv';
dotenv.config();
process.env.NTBA_FIX_319 = '1';

import * as http from 'http';
import Bot from './Bot';
new Bot();

// Heroku workaround
http.createServer((req: any, res: any) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
}).listen(process.env.PORT || 5000);
import * as low from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import * as path from 'path';
import logger from './logging';

const DATABASE_FILE = path.join(__dirname, '../../database.json');

class Database {
  dbHandle: low.LowdbSync<any>;

  constructor() {
    this.connect();
  }

  connect(): void {
    const adapter = new FileSync(DATABASE_FILE);
    this.dbHandle = low(adapter);
    this.loadDefaults();
    
    logger.info('Connected to database');
  }

  loadDefaults(): void {
    this.dbHandle.defaults({chats: []})
                 .write();
  }
}

export default Database;
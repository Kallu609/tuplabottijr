import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import logger from './logging';

const DATABASE_FILE = path.join(__dirname, '../../database.json');

const SCHEMA = {
  weatherCommand: {
    chats: []
  }
};

class Database {
  db: IDatabase;
  oldDb: IDatabase;

  constructor() {
    if (!fs.existsSync(DATABASE_FILE)) {
      fs.writeFileSync(DATABASE_FILE, JSON.stringify(SCHEMA));
    }

    const data = fs.readFileSync(DATABASE_FILE, 'utf8');
    
    try {
      this.db = JSON.parse(data);
    } catch (e) {
      this.db = SCHEMA;
      this.save();
    }
    
    this.autoSaver();
  }

  autoSaver() {
    if (!_.isEqual(this.oldDb, this.db)) {
      this.save();
    }

    this.oldDb = _.cloneDeep(this.db);

    setTimeout(() => {
      this.autoSaver();
    }, 3000);
  }

  save() {
    const json = JSON.stringify(this.db, null, 2);

    fs.writeFile(DATABASE_FILE, json, (err) => {
      if (err) throw err;
      logger.info('Database saved');
    });
  }
}

export default Database;
import * as schedule from 'node-schedule';
import config from '../../config';
import TuplabottiJr from '../Bot';

class Schedules {
  constructor(public base: TuplabottiJr) {
    const weatherCommand = this.base.commands.weather;

    schedule.scheduleJob(config.weatherCron, () => {
      weatherCommand.scheduleJob();
    });
  }
}

export default Schedules;
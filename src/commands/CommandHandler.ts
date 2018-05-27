import TuplabottiJr from '../Bot';
import commands from './Commands';
import HelpCommand from './HelpCommand';
import TrafficCommand from './TrafficCommand';
import WeatherCommand from './WeatherCommand';

export default class CommandHandler {
  help: HelpCommand;
  weather: WeatherCommand;
  traffic: TrafficCommand;
  
  constructor(public base: TuplabottiJr) {
    this.base = base;
    this.initCommands();
  }

  initCommands(): void {
    for (const command of commands) {
      const { classRef, ...rest } = command;
      const ref = new classRef(this.base);
      
      if (rest.name === 'help') {
        this.help = ref;
      }
      if (rest.name === 'weather') {
        this.weather = ref;
      }
      
      for (const [key, value] of Object.entries(rest)) {
        ref[key] = rest[key];
      }
    }
  }
}
import TuplabottiJr from '../Bot';
import commands from './Commands';
import HelpCommand from './HelpCommand';

export default class CommandHandler {
  help: HelpCommand;
  
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
      
      for (const [key, value] of Object.entries(rest)) {
        ref[key] = rest[key];
      }
    }
  }
}
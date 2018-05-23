import TuplabottiJr from '../Bot';
import commands from './Commands';

export default class CommandHandler {
  constructor(public base: TuplabottiJr) {
    this.base = base;
    this.initCommands();
  }

  initCommands(): void {
    for (const command of Object.values(commands)) {
      new command.class(this.base);
    }
  }
}
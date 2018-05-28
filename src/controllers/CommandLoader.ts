import TuplabottiJr from '../Bot';
import * as commands from './commands/Commands';

export default class CommandLoader {
  constructor(public base: TuplabottiJr) {
    this.base = base;
    this.loadCommands();
  }

  loadCommands(): void {
    for (const [name, Command] of Object.entries(commands)) {
      this.base.commands[name] = new Command(this.base);
    }
  }
}
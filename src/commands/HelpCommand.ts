import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';
import commands from './Commands';

export default class HelpCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/help$/, (msg, match) => {
      const chatId = msg.chat.id;

      const response = Object.keys(commands).map(name => {
        const command = commands[name];
        return `/${name} - ${command.helpText}`;
      }).join('\n');

      this.bot.sendMessage(chatId, response, this.base.messageOptions);
    });

    this.onText(/^\/help (.+)$/, (msg, args) => {
      const chatId = msg.chat.id;
      const name = args[0].toLowerCase();

      const response =
        (Object.keys(commands).includes(name)) ?
          `/${name} - ${commands[name].helpText}` :
          'That command does not exist.';
      
      this.bot.sendMessage(chatId, response, this.base.messageOptions);
    });
  }
}
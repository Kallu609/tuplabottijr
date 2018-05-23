import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';
import commands from './Commands';

export default class HelpCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.bot.onText(/^\/help$/, (msg, match) => {
      const chatId = msg.chat.id;

      const response = Object.keys(commands).map(name => {
        const command = commands[name];
        return `/${name} - ${command.helpText}`;
      }).join('\n');

      this.bot.sendMessage(chatId, response, this.base.messageOptions);
      this.commandTriggered(msg);
    });

    this.bot.onText(/^\/help (.+)$/, (msg, match) => {
      const chatId = msg.chat.id;
      const args = this.parseArguments(match);
      const name = args[0].toLowerCase();

      const response =
        (Object.keys(commands).includes(name)) ?
          `/${name} - ${commands[name].helpText}` :
          'That command does not exist.';
      
      this.bot.sendMessage(chatId, response, this.base.messageOptions);
    });
  }
}
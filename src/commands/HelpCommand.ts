import { Message } from 'node-telegram-bot-api';
import TuplabottiJr from '../Bot';
import CommandBase from './CommandBase';
import commands from './Commands';

export default class HelpCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/help$/, (msg, args) => {
      this.getAllHelpText(msg.chat.id);
    });

    this.onText(/^\/help \w+$/, (msg, args) => {
      this.getSingleHelpText(msg.chat.id, args[0]);
    });
  }

  getAllHelpText(chatId: number): void {
    const response = commands
      .map(command => {
        if (command.hidden) {
          return false;
        }

        return `\`${ ('/' + command.name).padEnd(8, ' ') } \`${ command.helpText }`;
      })
      .filter(command => command)
      .join('\n');

    this.sendMessage(chatId, response);
  }

  getSingleHelpText(chatId: number, commandName: string): void {
    commandName = commandName.toLowerCase();
    
    const getResponse = () => {
      const command = commands.find(x => x.name === commandName);
  
      if (command && !command.hidden && !command.disabled) {
        return `\`/${ command.name } ${ command.helpArgs }\`\n${ command.helpText }`;
      }
  
      return 'That command does not exist';
    };
  
    this.sendMessage(chatId, getResponse());
  }
}
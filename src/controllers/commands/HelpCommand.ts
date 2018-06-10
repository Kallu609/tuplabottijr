import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class HelpCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    
    this.name = 'help';
    this.helpText = 'Show help text';
    this.helpArgs = '[command]';

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
    const commands = Object.values(this.base.commands);
    
    const response = commands.map((command: any) => {
        if (command.hidden) {
          return false;
        }
        
        return `\`${ ('/' + command.name).padEnd(8, ' ') } \`${ command.helpText }`;
      })
      .filter((command: string | boolean) => command)
      .join('\n');

    this.sendMessage(chatId, response);
  }

  getSingleHelpText(chatId: number, commandName: string): void {
    commandName = commandName.toLowerCase();
    
    const getResponse = () => {
      const commands = Object.values(this.base.commands);
      const command = commands.find((x: any) => x.name === commandName);
  
      if (command && !command.hidden && !command.disabled) {
        const args = command.helpArgs ? (' ' + command.helpArgs) : '';

        return `\`/${ command.name }${ args }\`\n` +
               `${ command.helpText }`;
      }
  
      return 'That command does not exist';
    };
  
    this.sendMessage(chatId, getResponse());
  }
}
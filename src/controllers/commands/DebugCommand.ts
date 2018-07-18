import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class DebugCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'debug';
    this.helpText = 'Show date';
    this.hidden = true;
    
    this.eventHandler();
  }
  
  eventHandler(): void {
    this.onText(/^\/debug/, (msg, args) => {
      if (args.length === 1 && args[0] === 'schedule') {
        this.base.commands.weather.scheduleJob();
        return;
      }

      const weatherChats = this.db.get('chats').value();
      const weatherChatIds = weatherChats.map((chat: IDBChat) => `${chat.chatId} (${chat.weather.enabled})`);

      const debugText = this.buildDebugText({
        'Chat ID': msg.chat.id,
        'Date': (new Date).toString(),
        'Weather enabled': `[${ weatherChatIds.join(', ') }]`,
        'Watched cryptos': 'TODO'
      });

      this.sendMessage(msg.chat.id, debugText);
    });
  }

  buildDebugText(data: object): string {
    const result = Object.entries(data).map(item => {
      const [key, value] = item;
      return `\`${key.padEnd(16)} | ${value}\``;
    }).join('\n');

    return result;
  }
}
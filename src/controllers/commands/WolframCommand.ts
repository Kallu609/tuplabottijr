import config from '../../../config';
import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class WolframCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    
    this.name = 'wolfram';
    this.helpText = 'Asks question from Wolfram Alpha';
    this.helpArgs = '<question>';

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/\/wolfram.*/, async (msg, args) => {
      if (!args.length) {
        this.showHelp(msg.chat.id);
        return;
      }
      
      const question = args.join(' ');
      const queryUrl = `http://api.wolframalpha.com/v1/simple?appid=${config.WolframAlpha.token}&i=${question}`;
      
      const message = await this.sendMessage(msg.chat.id, '_Loading..._');

      try {
        await this.bot.sendPhoto(msg.chat.id, queryUrl);
        await this.bot.deleteMessage(msg.chat.id, message.message_id.toString());
      } catch (e) {
        await this.editMessage(message, `Could not find answer :(`);
      }
    });
  }
}
import axios from 'axios';
import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

export default class WikiCommand extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    
    this.name = 'wiki';
    this.helpArgs = '<search term>';
    this.helpText = 'Search from wiki';

    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/wiki/, async (msg, args) => {
      if (args.length === 0) {
        this.showHelp(msg.chat.id);
      }

      const tempMessage = await this.sendMessage(msg.chat.id, '_Searching..._');
      const url = `https://fi.wikipedia.org/w/api.php?action=opensearch&search=${args.join(' ')}&format=json`;

      const data = (await axios.get(url)).data;

      const titles = data[1];
      const descs = data[2];
      const links = data[3];

      if (titles.length === 0) {
        this.editMessage(tempMessage, 'Could not find anything.');
        return;
      }

      this.editMessage(tempMessage, `*${ titles[0] }* - [Wikipedia Link](${ links[0] })\n${ descs[0] }`);
    });
  }
}
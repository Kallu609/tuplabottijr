import config from '../../../config';
import TuplabottiJr from '../../Bot';
import RSSReader from '../../lib/api/RSSReader';
import CommandBase from './CommandBase';

export default class NewsCommand extends CommandBase {
  api: RSSReader;

  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'news';
    this.helpText = 'Show YLE news';

    this.api = new RSSReader();
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/news/, async (msg, args) => {
      const stories = await this.api.pickRandomStories();

      const result = stories.map((story: IStory) => {
        const description = (config.RSSReader.showDescriptions) ?
                            `\n${story.description}` : '';

        return `[${story.title}](${story.link})${description}`;
      }).join('\n\n');

      this.sendMessage(msg.chat.id, result, {
        disable_web_page_preview: true
      });
    });
  }
}
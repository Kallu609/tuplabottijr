import axios from 'axios';
import * as xml2js from 'xml2js';
import config from '../../../config';

export default class RSSReader {
  stories: Array<IStory>;

  async pickRandomStories(): Promise<IStory[]> {
    this.stories = [];

    for (const feedUrl of config.RSSReader.feeds) {
      await this.parseFeed(feedUrl);
    }

    const shuffled = this.stories.sort(() => .5 - Math.random());
    const selected = shuffled.slice(0, config.RSSReader.numberOfStories);

    return selected;
  }

  private async parseFeed(feedUrl: string): Promise<void> {
    const response = await axios.get(feedUrl);

    await xml2js.parseString(response.data, async (err, res) => {
      const itemBase = res.rss.channel[0].item;

      for (const item of itemBase) {
        const story: IStory = {
          link: item.link[0],
          title: item.title[0],
          description: item.description[0]
        };

        this.stories.push(story);
      }
    });
  }
}

new RSSReader();
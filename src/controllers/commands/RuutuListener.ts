import axios from 'axios';
import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

interface IVideoDetails {
  title: string;
  previewImage: string;
}

export default class RuutuListener extends CommandBase {
  constructor(base: TuplabottiJr) {
    super(base);
    this.hidden = true;
    this.eventHandler();
  }

  eventHandler(): void {
    const regex = /https:\/\/(naftis.github.io\/ruutuplayer\/|www.ruutu.fi\/video\/)(\d+)/g;

    this.onText(regex, async (msg, args, match) => {
      if (!match) return;
      
      const videoId = match[2];
      const details = await this.getVideoDetails(videoId);

      this.bot.sendPhoto(msg.chat.id, details.previewImage, {
        caption: details.title
      });
    });
  }

  async getVideoDetails(videoId: number | string): Promise<IVideoDetails> {
    const videoUrl = `https://www.ruutu.fi/video/${ videoId.toString() }`;
    const response = await axios.get(videoUrl);
    const data = response.data;
    
    const title = data.split('"og:title" content="')[1].split('"')[0];
    const rawPreview = data.split('"preview_image":"')[1].split('"')[0];
    const previewImage = rawPreview.replace(/\\/g, '');
    
    return { title, previewImage };
  }
}
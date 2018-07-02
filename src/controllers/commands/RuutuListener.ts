import axios from 'axios';
import TuplabottiJr from '../../Bot';
import CommandBase from './CommandBase';

interface IVideoDetails {
  title: string;
  description: string;
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

      try {
        const details = await this.getVideoDetails(videoId);

        await this.bot.sendPhoto(msg.chat.id, details.previewImage, {
          disable_notification: true
        });
        
        const response = `[⏯ Ruutuplayer](https://naftis.github.io/ruutuplayer/${videoId})\n` + 
                        `*${details.title}*\n\n${details.description}`;
        
        await this.sendMessage(msg.chat.id, response, {
          disable_notification: true
        });
      } catch (e) {
        return;
      }
    });
  }

  async getVideoDetails(videoId: number | string): Promise<IVideoDetails> {
    const videoUrl = `https://www.ruutu.fi/video/${ videoId.toString() }`;
    const response = await axios.get(videoUrl);
    const data = response.data;
    
    const title = data.split('"og:title" content="')[1].split('"')[0];

    const rawDesc = data.split('meta name="description" content="')[1].split('"')[0];
    const description = this.decodeEntities(rawDesc);

    const rawPreview = data.split('"preview_image":"')[1].split('"')[0];
    const previewImage = rawPreview.replace(/\\/g, '');
    
    return { title, description, previewImage };
  }

  decodeEntities(encodedString: string): string {
    const translateRe = /&(nbsp|amp|quot|lt|gt);/g;
    const translate = {
        'nbsp': ' ',
        'amp' : '&',
        'quot': '"',
        'lt'  : '<',
        'gt'  : '>'
    };

    return encodedString.replace(translateRe, (match, entity) => {
        return translate[entity];
    }).replace(/&#(\d+);/gi, (match, numStr) => {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}
}
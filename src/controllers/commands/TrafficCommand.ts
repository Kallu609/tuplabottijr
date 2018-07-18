import config from '../../../config';
import TuplabottiJr from '../../Bot';
import TrafficCamera from '../../lib/api/TrafficCamera';
import CommandBase from './CommandBase';

export default class TrafficCommand extends CommandBase {
  api: TrafficCamera;

  constructor(base: TuplabottiJr) {
    super(base);

    this.name = 'traffic';
    this.helpText = 'Shows traffic cameras';
    this.helpArgs = '[list] [add <url>] [remove <id>]';

    this.api = this.base.api.trafficCamera;
    this.eventHandler();
  }

  eventHandler(): void {
    this.onText(/^\/traffic/, async (msg, args) => {
      const chat = this.getChat(msg.chat.id);
      const cameraUrls = chat.traffic.cameras.map(camera => camera.url);
      const urlRegexp = /^https:\/\/www.kelikamerat.info\/kelikamerat\/.+$/;

      if (args.length === 1 && args[0] === 'list') {
        const cameras = chat.traffic.cameras.map((camera, index) => {
          const idStr = (`\`\[${ (index + 1).toString() }\]\``);
          return `${idStr} ${camera.cityName} - ${camera.cameraName}`;
        });

        const joined = (cameras.length > 0) ? cameras.join('\n') : 'None yet!';

        this.sendMessage(msg.chat.id,
          `*Traffic cameras for this chat*\n${ joined }`
        );
        return;
      }

      if (args.length === 2 && args[0] === 'add') {
        const cameraUrl = args[1];
        const exists = chat.traffic.cameras.find(x => x.url === cameraUrl);
        
        if (exists) {
          this.sendMessage(msg.chat.id, '❗️ That traffic camera is already added');
          return;
        }

        if (!cameraUrl.match(urlRegexp)) {
          this.sendMessage(msg.chat.id, '❗️ Invalid URL');
          return;
        }

        const tempMessage = await this.sendMessage(msg.chat.id, '_Validating places..._');
        const cameras = await this.api.getTrafficCameras([cameraUrl]);
        
        if (!cameras.length) {
          this.editMessage(tempMessage, '❌ Could not add traffic camera');
          return;
        }
        
        const camera = cameras[0];
        const databaseEntry = {
          cameraName: camera.cameraName,
          cityName: camera.cityName,
          url: cameraUrl
        };
        
        this.db.get('chats')
          .find({ chatId: msg.chat.id })
          .set('traffic.cameras', chat.traffic.cameras.concat(databaseEntry))
          .write();

        this.editMessage(tempMessage,
          `✅ Traffic camera added!\n` +
          `${camera.cityName} - ${camera.cameraName}`);
        return;
      }

      if (args.length === 2 && args[0] === 'remove') {
        const id = parseInt(args[1], 10);

        if (isNaN(id) || (id - 1) > chat.traffic.cameras.length) {
          this.sendMessage(msg.chat.id, `❗️ Invalid ID.\nType \`/${this.name} list\` to see available ID's`);
          return;
        }

        const removed = chat.traffic.cameras.splice((id - 1), 1)[0];

        this.db.get('chats')
          .find({ chatId: msg.chat.id })
          .set('traffic.cameras', chat.traffic.cameras)
          .write();
        
        this.sendMessage(msg.chat.id,
          `🚮 Removed ${removed.cityName} - ${removed.cameraName}`
        );

        return;
      }

      if (!args.length) {
        if (!cameraUrls.length) {
          this.sendMessage(msg.chat.id,
            `No traffic cameras added!\n` + 
            `Type \`/${this.name} add <camera url>\` to add camera URL.\n\n` +
            `_(kelikamerat.info only supported)_`
          );
          return;
        }

        const tempMessage = await this.sendMessage(msg.chat.id, '_Loading traffic cameras..._');
        await this.sendTrafficCameras(msg.chat.id, cameraUrls);
        this.bot.deleteMessage(msg.chat.id, tempMessage.message_id.toString());
        return;
      }

      this.showHelp(msg.chat.id);
    });
  }

  async sendTrafficCameras(chatId: number, cameraUrls: Array<string>): Promise<void> {
    const trafficCameras = await this.api.getTrafficCameras(cameraUrls);

    for (const trafficCamera of trafficCameras) {
      const cameraText = `${trafficCamera.cityName} - ${trafficCamera.cameraName}`;
      let timestampText;

      if (trafficCamera.timestamp) {
        const time = new Date(trafficCamera.timestamp * 1000);
        const timestamp = ('0' + time.getHours()).slice(-2) + ':' +
                          ('0' + time.getMinutes()).slice(-2);

        timestampText = `[${timestamp}]`;
      } else {
        timestampText = '';
      }

      const caption = `${timestampText} ${cameraText}`;
      await this.bot.sendPhoto(chatId, trafficCamera.url, {
        caption, disable_notification: true
      });
    }
  }
}
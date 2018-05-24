import * as fs from 'fs';
import * as path from 'path';

const SETTINGS_FILE = path.join(__dirname, 'bot-settings.json');

export function read(): ISettings {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, '{}');
  }

  const content = fs.readFileSync(SETTINGS_FILE, 'utf8');
  const settings = JSON.parse(content) as ISettings;

  return settings;
}

export function write(settings: ISettings): void {
  const oldSettings = read();
  const newSettings = { ...oldSettings, ...settings };

  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings));
}
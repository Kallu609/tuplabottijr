import EchoCommand from './EchoCommand';
import HelpCommand from './HelpCommand';
import JekkuCommand from './JekkuCommand';
import PriceCommand from './PriceCommand';
import QuitCommand from './QuitCommand';
import WeatherCommand from './WeatherCommand';

const commands: Array<ICommand> = [
  {
    classRef:  HelpCommand,
    name:      'help',
    helpText:  'Show help text',
    helpArgs:  '[command]'
  },
  {
    classRef:  EchoCommand,
    name:      'echo',
    helpText:  'Echoes to you',
    hidden:    true
  },
  {
    classRef:  PriceCommand,
    name:      'price',
    helpText:  'Shows price of cryptocurrencies',
    helpArgs:  '<crypto(s)>'
  },
  {
    classRef:  JekkuCommand,
    name:      'jekku',
    helpText:  'Jekuta kaikkia',
    hidden:    true
  },
  {
    classRef:  WeatherCommand,
    name:      'weather',
    helpText:  'Show weather for today',
    helpArgs:  '[enable | disable]'
  },
  {
    classRef:  QuitCommand,
    name:      'quit',
    helpText:  'Quit bot',
    hidden:    true,
    disabled:  true
  }
];
export default commands;
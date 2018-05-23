import EchoCommand from './EchoCommand';
import HelpCommand from './HelpCommand';
import JekkuCommand from './JekkuCommand';
import PriceCommand from './PriceCommand';
import QuitCommand from './QuitCommand';

const commands: ICommands = {
  help: {
    class:    HelpCommand,
    helpText: 'Show help text',
  },

  echo: {
    class:    EchoCommand,
    helpText: 'Echoes to you'
  },

  price: {
    class:    PriceCommand,
    helpText: 'Shows price of cryptocurrency'
  },

  jekku: {
    class:    JekkuCommand,
    helpText: 'Jekuta kaikkia'
  },

  quit: {
    class:    QuitCommand,
    helpText: 'Quit bot'
  }
};

export default commands;
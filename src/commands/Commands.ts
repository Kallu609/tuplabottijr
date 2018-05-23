import EchoCommand from './EchoCommand';
import HelpCommand from './HelpCommand';
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

  quit: {
    class:    QuitCommand,
    helpText: 'Quit bot'
  }
};

export default commands;
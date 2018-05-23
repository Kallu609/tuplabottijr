import EchoCommand from './Echo';
import HelpCommand from './Help';

const commands: ICommands = {
  help: {
    class:    HelpCommand,
    helpText: 'Show help text',
  },

  echo: {
    class:    EchoCommand,
    helpText: 'Echoes to you'
  }
};

export default commands;
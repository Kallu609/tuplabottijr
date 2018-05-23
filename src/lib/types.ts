
interface IType extends Function {}

interface ICommand {
  // tslint:disable-next-line:no-any
  class:    any;
  helpText: string;
}

interface ICommands {
  [key: string]: ICommand;
}
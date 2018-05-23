
interface IType extends Function {}

interface ICommand {
  // tslint:disable-next-line:no-any
  classRef:  any;
  name:      string;
  helpText:  string;
  helpArgs?: string;
  hidden?:   boolean;
}
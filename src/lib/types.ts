
interface IType extends Function {}

interface ICommand {
  classRef:  any;
  name:      string;
  helpText:  string;
  helpArgs?: string;
  hidden?:   boolean;
  disabled?: boolean;
}

interface ISettings {
  weatherCommand?: {
    chatsEnabled: Array<number>;
  };

  cryptoCompare?: {
    watchedCurrencies: Array<string>;
  };
}

// OpenWeatherMap
interface ICity {
  id: number;
  weatherLines: Array<string>;
}

interface ICities {
  [key: string]: ICity;
}
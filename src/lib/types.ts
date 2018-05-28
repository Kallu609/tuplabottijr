interface IAPIList {
  [key: string]: any;
}

type ICommandList = IAPIList;

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

// RSSReader
interface IStory {
  link: string;
  title: string;
  description: string;
}
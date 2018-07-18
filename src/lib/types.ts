// Database
interface IDBChat {
  chatId: number;

  weather: {
    places: Array<string>;
    enabled: boolean;
  };

  traffic: {
    cameras: Array<ITrafficCamera>;
  };
}

// API
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

// TrafficCamera
interface ITrafficCamera {
  url: string;
  timestamp?: number;
  cameraName?: string;
  cityName?: string;
}

// RSSReader
interface IStory {
  link: string;
  title: string;
  description: string;
}
import axios from 'axios';
import config from '../../../config';

const API_ENDPOINTS = {
  temperature: 'https://api.openweathermap.org/data/2.5/group',
  forecast: 'http://api.openweathermap.org/data/2.5/forecast'
};

export default class OpenWeatherMap {
  cities: ICities;

  constructor() {
    this.cities = {};
  }

  async getWeatherReport(): Promise<string> {
    await this.getForecastTexts();
    await this.getTemperatureTexts();

    return Object.keys(this.cities).map((name: string) => {
      const city = this.cities[name];
      const weatherLines = city.weatherLines.join('\n');

      return `*${name}*\n${weatherLines}`;
    }).join('\n\n');
  }
  
  private async getForecastTexts(): Promise<void> {
    for (const city of config.openWeatherMap.cities) {
      const forecastJson = await this.getCityForecast(city.name);
      const forecasts = forecastJson.list.slice(0, config.openWeatherMap.weatherLinesCount - 1);
      
      const forecastLines = forecasts.map((forecast: any) => {
        return this.getWeatherLine(forecast);
      });

      this.cities[forecastJson.city.name] = {
        id: forecastJson.city.id,
        weatherLines: forecastLines
      } as ICity;
    }
  }

  private async getTemperatureTexts(): Promise<void> {
    const cityIds = Object.keys(this.cities).map(cityName => {
      return this.cities[cityName].id;
    });
    
    const tempsJson = await this.getCitiesTemperature(cityIds);

    tempsJson.list.map((city: any) => {
      this.cities[city.name].weatherLines.unshift(
        this.getWeatherLine(city)
      );
    });
  }

  private getWeatherLine(city: any): string {
    const icon = weatherIcons[city.weather[0].icon];
    const time = new Date(city.dt * 1000);
    const timeStr =
      `${ ('0' + time.getHours()).slice(-2) }:` +
      `${ ('0' + time.getMinutes()).slice(-2) }`;
    const temp = `${ city.main.temp.toFixed(1) }°C`;
    const desc = city.weather[0].description;

    if (config.openWeatherMap.showDescriptions) {
      return `\`${icon} ${ timeStr.padEnd(8, ' ') }` +
             `${ temp.padEnd(8, ' ') }\`${desc}`;
    }

    return `\`${icon} ${ timeStr.padEnd(8, ' ') }${temp}\``;
  }
  
  private async getCitiesTemperature(cityIds: Array<number>): Promise<any> {
    const response = await axios.get(API_ENDPOINTS.temperature, {
      params: {
        id: cityIds.join(','),
        lang: 'fi',
        units: 'metric',
        mode: 'json',
        appid: config.openWeatherMap.token
      }
    });

    return response.data;
  }

  private async getCityForecast(city: string): Promise<any> {
    const response = await axios.get(API_ENDPOINTS.forecast, {
      params: {
        q: city,
        lang: 'fi',
        units: 'metric',
        mode: 'json',
        appid: config.openWeatherMap.token
      }
    });

    return response.data;
  }

  async getTrafficCameras(): Promise<object> {
    const cameras = {};

    for (const city of config.openWeatherMap.cities) {
      const response = await axios.get(city.camera);
      const parts = response.data.split('","message":"","time_stamp');
      
      const urlEscaped = parts[parts.length - 2].split('"url":"')[1];
      const url = urlEscaped.replace(/\\/g, '');

      cameras[city.name] = url;
    }

    return cameras;
  }
}

const weatherIcons = {
  '01d': '☀️',
  '01n': '☀️',
  '02d': '⛅️',
  '02n': '⛅️',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧',
  '09n': '🌧',
  '10d': '🌦',
  '10n': '🌦',
  '11d': '⛈',
  '11n': '⛈',
  '13d': '🌨',
  '13n': '🌨',
  '50d': '🌫',
  '50n': '🌫'
};
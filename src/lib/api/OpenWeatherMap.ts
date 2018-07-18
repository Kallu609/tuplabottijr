import axios from 'axios';
import config from '../../../config';

const API_ENDPOINTS = {
  temperature: 'https://api.openweathermap.org/data/2.5/group',
  forecast: 'http://api.openweathermap.org/data/2.5/forecast',
  weather: 'https://api.openweathermap.org/data/2.5/weather'
};

export default class OpenWeatherMap {
  cities: ICities;

  async getWeatherReport(cities: Array<string>): Promise<string> {
    this.cities = {};
    let tries = 0;

    while (tries < 3) {
      try {
        await this.getForecastTexts(cities);
        await this.getTemperatureTexts();
        break;
      } catch (e) {
        if (e.data && e.data.message === 'city not found') {
          return '';
        }
        
        tries++;
      }
    }

    return Object.keys(this.cities).map((name: string) => {
      const city = this.cities[name];
      const weatherLines = city.weatherLines.join('\n');

      return `*${name}*\n${weatherLines}`;
    }).join('\n\n');
  }
  
  private async getForecastTexts(cities: Array<string>): Promise<void> {
    for (const city of cities) {
      const forecastJson = await this.getCityForecast(city);
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

  async validatePlaces(cities: Array<string>): Promise<Array<string>> {
    const validCities: Array<string> = [];

    for (const city of cities) {
      try {
        const response = await axios.get(API_ENDPOINTS.weather, {
          params: {
            q: city,
            appid: config.openWeatherMap.token
          }
        });

        const data = response.data;

        if (data.cod === 200) {
          validCities.push(data.name);
        }
      } catch (e) {
        continue;
      }
    }

    return validCities;
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
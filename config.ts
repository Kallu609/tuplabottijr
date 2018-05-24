const config = {
  // Telegram bot token
  botToken: process.env.BOT_TOKEN || '',

  // OpenWeatherMap token
  openWeatherMap: {
    token: process.env.OPENWEATHERMAP_TOKEN,
    weatherLinesCount: 6,
    showDescriptions: false,
    cities: [
      {
        name: 'Lahti,fi',
        // camera: 'https://www.kelikamerat.info/kelikamerat/Pirkanmaa/Tampere/tie-3495/Tampere_Viinikank-Ratapihank'
      },
      {
        name: 'Tampere,fi',
      }
    ]
  },

  // See https://github.com/node-schedule/node-schedule#cron-style-scheduling
  weatherCron: '7 * * *',

  // Bot won't process commands that are older than (seconds)
  commandTimeout: 10,

  // Supported fiat currencies
  fiatCurrencies: ['USD', 'EUR', 'GBP'],
  
  // Price update interval (seconds)
  priceUpdateInterval: 5,

  // If coinlist is older than this (seconds), it's fetched from API instead of cache
  coinlistLifespan: 300
};

export default config;
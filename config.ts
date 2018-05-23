const config = {
  // Telegram bot token
  botToken: process.env.BOT_TOKEN || '',

  // Bot won't process commands that are older than (seconds)
  commandTimeout: 10,

  // If coinlist is older than this (seconds), it's fetched from API instead of cache
  coinlistLifespan: 300
};

export default config;
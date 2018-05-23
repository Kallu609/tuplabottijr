const config = {
  // Telegram bot token
  botToken: process.env.BOT_TOKEN || '',

  // Bot won't process commands that are older than (seconds)
  commandTimeout: 10
};

export default config;
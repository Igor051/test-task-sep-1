export default {
  USE_EXTERNAL_API: process.env.USE_EXTERNAL_API === 'true',
  API_KEY: process.env.API_KEY,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
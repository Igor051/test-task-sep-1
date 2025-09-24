import 'dotenv/config';

export default {
  MODEL_TYPE: process.env.MODEL_TYPE,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY
};
import "dotenv/config";

export default {
  MODEL_TYPE: process.env.MODEL_TYPE,
  GEMINI_MODEL_VERSION: process.env.GEMINI_MODEL_VERSION || "gemini-2.0-flash",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

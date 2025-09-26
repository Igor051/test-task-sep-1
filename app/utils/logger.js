import pino from "pino";
import config from "../config.js";

const logger = pino({
  level: config.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname,time",
    },
  },
});

function getLogger() {
  return logger;
}

export default getLogger;

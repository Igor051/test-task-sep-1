import config from '../config.js';
import { HttpError } from '../utils/errors.js';
import GeminiModel from './geminiModel.js';
import LocalModel from './localModel.js';

export function getModel() {
  switch (config.MODEL_TYPE) {
    case 'local':
      return new LocalModel();
    case 'external':
      return new GeminiModel("gemini-2.0-flash");
    // default:
    //   throw new HttpError(`Invalid model type: ${config.MODEL_TYPE}`, 500);
  }
}
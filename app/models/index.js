import config from '../config.js';
import GeminiModel from './geminiModel.js';
import LocalModel from './localModel.js';

export function getModel() {
  const models = {
    local: () => new LocalModel(),
    gemini: () => new GeminiModel(config.GEMINI_MODEL_VERSION)
  };

  const modelFactory = models[config.MODEL_TYPE];
  if (!modelFactory) {
    throw new Error(`Invalid model type: ${config.MODEL_TYPE}`);
  }

  return modelFactory();
}
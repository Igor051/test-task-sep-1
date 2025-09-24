import config from '../config.js';
import ExternalApi from './externalApi.js';
import LocalModel from './localModel.js';

export function getModel() {
  switch (config.MODEL_TYPE) {
    case 'local':
      return new LocalModel();
    case 'external':
      return new ExternalApi();
    default:
      throw new Error(`Invalid model type: ${config.MODEL_TYPE}`);
  }
}
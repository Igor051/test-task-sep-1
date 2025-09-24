import config from '../config.js';
import ExternalApi from './externalApi.js';
import LocalModel from './localModel.js';

export function getModel() {
  return config.USE_EXTERNAL_API ? new ExternalApi() : new LocalModel();
}
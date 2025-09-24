import config from '../config.js';

export default class ExternalApi {
  async process(data) {
    return { processed: true, source: 'external', data };
  }
}
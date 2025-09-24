export default class LocalModel {
  async process(data) {
    return { processed: true, source: 'local', data };
  }
}
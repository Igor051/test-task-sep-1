export default class ModelProvider {
    /**
   * @param {string} text
   * @returns {Promise<string[]>} Array of topics
   */
  async classify(text) {
    throw new Error("Method 'classify' must be implemented");
  }

  /**
   * @param {string} text
   * @returns {Promise<string>} Summary string
   */
  async summarize(text) {
    throw new Error("Method 'summarize' must be implemented");
  }
}

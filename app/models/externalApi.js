import config from '../config.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import getLogger from "../utils/logger.js";
import ModelProvider from './modelProvider.js';

const logger = getLogger();

export default class ExternalApi extends ModelProvider {
  constructor() {
    super()
    const apiKey = config.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  /**
   * Classify text into topics
   * @param {string} text
   * @returns {Promise<string[]>} array of topic strings
   */
async classify(text) {
  try {
    if (!text || !text.trim()) return [];

    const prompt = `Classify the following email into relevant topics (e.g., finance, hr, technical, marketing): "${text}". Return a JSON array of topics only.`;

    const result = await this.model.generateContent(prompt);
    let content = result.response?.text?.()?.trim(); // safe access

    getLogger().info({content}, 'Raw AI response:');

    if (!content) return [];

    try {
      // Remove code block markers if present
      content = content.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();

      // Ensure it's actually a string before parsing
      if (typeof content === "string") {
        const topics = JSON.parse(content);
        if (Array.isArray(topics)) return topics;
      }

      // If content is already an array (some SDKs may return it parsed)
      if (Array.isArray(content)) return content;

      logger.warn('Unexpected classification format, returning empty array');
      return [];
    } catch (err) {
      logger.error('Failed to parse classification output:',);
      return [];
    }
  } catch (err) {
    logger.error(`Classification API call failed: ${err.message}`);
    return [];
  }
}



  /**
   * Summarize text into 1–2 sentence summary
   * @param {string} text
   * @returns {Promise<string>} summary string
   */
  async summarize(text) {
    try {
      if (!text || !text.trim()) return "";

      const prompt = `Summarize the following email in 1-2 sentences: "${text}"`;

      const result = await this.model.generateContent(prompt);

      getLogger().info(result.response.text())
      return result.response.text()?.trim() || "";
    } catch (err) {
      logger.error(err, `Summarization API call failed: ${err.message}`);
      return "";
    }
  }
}

import config from '../config.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import getLogger from "../utils/logger.js";
import ModelProvider from './modelProvider.js';

const logger = getLogger();

export default class GeminiModel extends ModelProvider {
  constructor(model) {
    super()
    const apiKey = config.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({ model });
    this.cache = new Map();
  }

  /**
   * Classify text into topics
   * @param {string} text
   * @returns {Promise<string[]>} array of topic strings
   */
async classify(text) {
  try {
    if (!text || !text.trim()) return [];

    const cacheKey = `classify:${text.substring(0, 100)}`;
    if (this.cache.has(cacheKey)) {
      logger.info('Cache hit for classification');
      return this.cache.get(cacheKey);
    }

    const prompt = `Classify the following email into relevant topics (e.g., finance, hr, technical, marketing): "${text}". Return a JSON array of topics only.`;

    const result = await this.model.generateContent(prompt);
    let content = result.response?.text?.()?.trim();

    logger.info({content}, 'Raw AI response:');

    if (!content) return [];

    // Remove code block markers if present
    content = content.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();

    let topics = [];
    if (typeof content === "string") {
      topics = JSON.parse(content);
      if (!Array.isArray(topics)) topics = [];
    } else if (Array.isArray(content)) {
      topics = content;
    }

    this.cache.set(cacheKey, topics);
    return topics;

  } catch (err) {
      const context = `Classification API call failed: ${err.message}`
      logger.error(err, context);
      throw new Error(context);
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

      const cacheKey = `summarize:${text.substring(0, 100)}`;
      if (this.cache.has(cacheKey)) {
        logger.info('Cache hit for summarization');
        return this.cache.get(cacheKey);
      }

      const prompt = `Summarize the following email in 1-2 sentences: "${text}"`;

      const result = await this.model.generateContent(prompt);
      const summary = result.response.text()?.trim() || "";

      this.cache.set(cacheKey, summary);
      return summary;
    } catch (err) {
      const context = `Summarization API call failed: ${err.message}`
      logger.error(err, context);
      throw new Error(context);
    }
  }
}

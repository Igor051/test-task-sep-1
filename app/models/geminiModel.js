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
    if (!text || !text.trim()) return [];

    const cacheKey = `classify:${text.substring(0, 100)}`;
    const cached = this.#getCached(cacheKey);
    if (cached) return cached;

    const prompt = `Classify the following email into relevant topics (e.g., finance, hr, technical, marketing): "${text}". Return a JSON array of topics only.`;

    let content = await this.#generateContent(prompt, 'Classification');
    logger.info({content}, 'Raw AI response:');

    if (!content) return [];

    content = this.#cleanResponse(content);
    
    let topics = [];
    if (typeof content === "string") {
      topics = JSON.parse(content);
      if (!Array.isArray(topics)) topics = [];
    } else if (Array.isArray(content)) {
      topics = content;
    }

    this.cache.set(cacheKey, topics);
    return topics;
  }

  /**
   * Summarize text into 1–2 sentence summary
   * @param {string} text
   * @returns {Promise<string>} summary string
   */
  async summarize(text) {
    if (!text || !text.trim()) return "";

    const cacheKey = `summarize:${text.substring(0, 100)}`;
    const cached = this.#getCached(cacheKey);
    if (cached) return cached;

    const prompt = `Summarize the following email in 1-2 sentences: "${text}"`;
    const summary = await this.#generateContent(prompt, 'Summarization') || "";

    this.cache.set(cacheKey, summary);
    return summary;
  }

  /**
   * Batch classify multiple texts in single API call
   * @param {string[]} texts
   * @returns {Promise<string[][]>} array of topic arrays
   */
  async classifyBatch(texts) {
    try {
      if (!texts || texts.length === 0) return [];

      const batchPrompt = `Classify each email into topics. Return JSON array of arrays:
${texts.map((text, i) => `${i}: "${text.substring(0, 200)}"`).join('\n')}
Format: [["topic1","topic2"],["topic3"]]`;

      const content = await this.#generateContent(batchPrompt, 'Batch classification');
      if (!content) return texts.map(() => []);

      const results = JSON.parse(this.#cleanResponse(content));
      return Array.isArray(results) ? results : texts.map(() => []);
    } catch (err) {
      logger.error(err, 'Batch classification failed, falling back to individual calls');
      return Promise.all(texts.map(text => this.classify(text)));
    }
  }

  /**
   * Batch summarize multiple texts in single API call
   * @param {string[]} texts
   * @returns {Promise<string[]>} array of summaries
   */
  async summarizeBatch(texts) {
    try {
      if (!texts || texts.length === 0) return [];

      const batchPrompt = `Summarize each email in 1-2 sentences. Return JSON array:
${texts.map((text, i) => `${i}: "${text.substring(0, 300)}"`).join('\n')}
Format: ["summary1","summary2"]`;

      const content = await this.#generateContent(batchPrompt, 'Batch summarization');
      if (!content) return texts.map(() => "");

      const results = JSON.parse(this.#cleanResponse(content));
      return Array.isArray(results) ? results : texts.map(() => "");
    } catch (err) {
      logger.error(err, 'Batch summarization failed, falling back to individual calls');
      return Promise.all(texts.map(text => this.summarize(text)));
    }
  }


  // Helper method to check cache
  #getCached(key) {
    if (this.cache.has(key)) {
      logger.info(`Cache hit for ${key.split(':')[0]}`);
      return this.cache.get(key);
    }
    return null;
  }

  // Helper method to clean AI response
  #cleanResponse(content) {
    return content.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
  }

  // Helper method to generate content with error handling
  async #generateContent(prompt, operation) {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response?.text?.()?.trim();
    } catch (err) {
      const context = `${operation} API call failed: ${err.message}`
      logger.error(err, context);
      throw new Error(context);
    }
  }

}

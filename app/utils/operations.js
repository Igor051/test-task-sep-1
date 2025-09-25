// Process items for summarization - returns {id, summary} objects
const summarizeItems = async (items, model) =>
  Promise.all(items.map(async (item) => ({
    id: item.id,
    summary: await model.summarize(item.body),
  })));

// Process items for classification - returns {id, topics} objects
const classifyItems = async (items, model) =>
  Promise.all(items.map(async (item) => ({
    id: item.id,
    topics: await model.classify(item.body),
  })));

// Strategy map for different processing modes
export const operations = {
  summarize: summarizeItems,
  classify: classifyItems,
};

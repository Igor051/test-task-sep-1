// Process items for summarization - returns {id, summary} objects
const summarizeItems = async (items, model) => {
  // Use batch processing if available and items > 1
  if (model.summarizeBatch && items.length > 1) {
    const summaries = await model.summarizeBatch(items.map(item => item.body));
    return items.map((item, index) => ({
      id: item.id,
      summary: summaries[index] || ""
    }));
  }
  
  // Fallback to individual processing
  return Promise.all(items.map(async (item) => ({
    id: item.id,
    summary: await model.summarize(item.body),
  })));
};

// Process items for classification - returns {id, topics} objects
const classifyItems = async (items, model) => {
  // Use batch processing if available and items > 1
  if (model.classifyBatch && items.length > 1) {
    const topicsArray = await model.classifyBatch(items.map(item => item.body));
    return items.map((item, index) => ({
      id: item.id,
      topics: topicsArray[index] || []
    }));
  }
  
  // Fallback to individual processing
  return Promise.all(items.map(async (item) => ({
    id: item.id,
    topics: await model.classify(item.body),
  })));
};

// Strategy map for different processing modes
export const operations = {
  summarize: summarizeItems,
  classify: classifyItems,
};

const summarizeItems = async (items, model) =>
  Promise.all(items.map(async (item) => ({
    id: item.id,
    summary: await model.summarize(item.body),
  })));

const classifyItems = async (items, model) =>
  Promise.all(items.map(async (item) => ({
    id: item.id,
    topics: await model.classify(item.body),
  })));

export const operations = {
  summarize: summarizeItems,
  classify: classifyItems,
};

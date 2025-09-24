import { getModel } from './models/index.js';
import getLogger from './utils/logger.js';
import middy from '@middy/core';

const handlerController = async (event, context) => {
  try {
    getLogger().info({event}, 'Handler called with event:');

    const model = getModel();

    let result;
    switch (event.mode) {
      case "summarize":
        result = await Promise.all(event.items.map(item => model.summarize(item.body)));
        break;
      case "classify":
        result = await Promise.all(event.items.map(item => model.classify(item.body)));
        getLogger().info({result}, "switch case")
        break;
      default:
        result = { error: 'Invalid mode' };
        break;
    }

    getLogger().info({result}, "after switch")

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    getLogger().error(error, 'Handler error:');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const handler = middy(handlerController)
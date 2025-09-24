import { getModel } from './models/index.js';
import getLogger from './utils/logger.js';
import middy from 'middy';

const handlerController = async (event, context) => {
  try {
    
    getLogger().info(event, 'Handler called with event:');

    const model = getModel();
    const result = await model.process(event.body);
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    getLogger().error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const handler = middy(handlerController)
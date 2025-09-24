import { getModel } from './models/index.js';
import getLogger from './utils/logger.js';
import middy from '@middy/core';
import validateMode from './middleware/validateMode.js';
import errorHandler from './middleware/errorHandler.js';
import validateEmails from './middleware/validateEmails.js';
import { operations } from './utils/operations.js';

const handlerController = async (event) => {
  try {

    getLogger().info({event}, 'Handler called with event:');

    const model = getModel();

    const result = await operations[event.mode](event.items, model);

    getLogger().info({result}, "operation completed");

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    getLogger().error(error, 'Handler error:');
    throw error;
  }
};

export const handler = middy(handlerController)
  .use(validateMode())
  .use(validateEmails())
  .use(errorHandler())
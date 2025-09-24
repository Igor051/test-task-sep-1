import getLogger from '../utils/logger.js';

const errorHandler = () => ({
  onError: (request) => {
    const { error } = request;
        
    request.response = {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ 
        error: error.message || 'Internal server error' 
      })
    };
  }
});

export default errorHandler;
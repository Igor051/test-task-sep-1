const errorHandler = () => ({
  onError: (request) => {
    const { error } = request;


    if(error.httpError) {
      request.response = {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ 
        error: error.message || 'Internal server error' 
      })
    };
    } else {
    request.response = {
    statusCode: 500,
    body: JSON.stringify({ error: 'Internal server error' })
  };}

  }
});

export default errorHandler;
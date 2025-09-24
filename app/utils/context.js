 // Fake context (optional)
  const context = {
    functionName: "localTest",
    awsRequestId: "test-1234",
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: "$LATEST",
    invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:localTest",
    memoryLimitInMB: "128",
    logGroupName: "/aws/lambda/localTest",
    logStreamName: "2023/01/01/[$LATEST]test",
    getRemainingTimeInMillis: () => 30000,
    done: () => {},
    fail: () => {},
    succeed: () => {}
  };

  export const getContext = () => context;
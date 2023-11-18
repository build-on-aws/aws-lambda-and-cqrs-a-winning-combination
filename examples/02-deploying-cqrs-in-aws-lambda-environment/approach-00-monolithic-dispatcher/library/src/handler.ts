import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logMetrics } from '@aws-lambda-powertools/metrics';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';

import { logger, metrics, tracer } from './powertools/utilities';

const plainHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.appendKeys({ resource_path: event.requestContext.resourcePath });

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello, World!' })
    };
  } catch (error: any) {
    logger.error('Unexpected error occurred', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Exception caught!' })
    };
  }
};

const main = middy(plainHandler)
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

export {
  plainHandler,
  main
};

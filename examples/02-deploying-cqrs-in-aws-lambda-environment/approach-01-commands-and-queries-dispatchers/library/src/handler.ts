import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { logMetrics } from "@aws-lambda-powertools/metrics";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";

import { responseBuilder } from 'library-system-common';
import { logger, metrics, tracer } from "./powertools/utilities";

const plainHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.appendKeys({ resource_path: event.requestContext.resourcePath });

  try {
    return responseBuilder({ message: 'Hello, World!' });
  } catch (error: any) {
    logger.error('Unexpected error occurred', error);

    return responseBuilder({ message: 'Exception caught!' }, 500);
  }
};

const commands = middy(plainHandler)
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

const queries = middy(plainHandler)
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

export {
  plainHandler,
  commands,
  queries
};

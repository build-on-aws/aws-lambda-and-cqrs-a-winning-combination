import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { logMetrics } from "@aws-lambda-powertools/metrics";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import { extractDispatcherContextFromLambdaParameters } from "./common/lambda-adapter";
import { logger, metrics, tracer } from "./common/powertools";
import { Dispatcher } from "./dispatcher/Dispatcher";
import { RepositoriesFactory } from "./factories/RepositoriesFactory";

const plainMain = async (event: APIGatewayProxyEvent, lambdaContext: Context): Promise<APIGatewayProxyResult> => {
  try {
    logger.appendKeys({ resource_path: event.requestContext.resourcePath });

    const context = extractDispatcherContextFromLambdaParameters(event, lambdaContext);
    const repositoriesFactory = new RepositoriesFactory();
    const response = Dispatcher.create(context, repositoriesFactory).dispatch();

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    logger.error("Uncaught Exception", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Uncaught Exception" }),
    };
  }
};

const main = middy(plainMain)
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

export { plainMain, main };

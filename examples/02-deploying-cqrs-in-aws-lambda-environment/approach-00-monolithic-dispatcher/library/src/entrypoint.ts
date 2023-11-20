import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { logMetrics } from "@aws-lambda-powertools/metrics";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import { extractDispatcherContext, extractDatabaseDetails } from "./common/lambda-adapter";
import { logger, metrics, tracer } from "./common/powertools";
import { DatabaseProvider } from "./database/DatabaseProvider";
import { Dispatcher } from "./dispatcher/Dispatcher";

const plainMain = async (event: APIGatewayProxyEvent, lambdaContext: Context): Promise<APIGatewayProxyResult> => {
  try {
    logger.appendKeys({ resource_path: event.requestContext.resourcePath });

    const context = extractDispatcherContext(event, lambdaContext);
    const databaseDetails = extractDatabaseDetails(process.env);

    const databaseProvider = new DatabaseProvider(databaseDetails);

    const response = await Dispatcher.create(context, databaseProvider).dispatch();

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

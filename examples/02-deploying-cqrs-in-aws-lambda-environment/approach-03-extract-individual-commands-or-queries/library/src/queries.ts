import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { responseBuilder } from "library-system-common";
import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { logMetrics } from "@aws-lambda-powertools/metrics";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import { extractQueriesDispatcherContext, extractDatabaseDetails } from "library-system-common/common/lambda-adapter";
import { logger, metrics, tracer } from "library-system-common/common/powertools";
import { DatabaseProvider } from "library-system-common/database/DatabaseProvider";
import { QueriesDispatcher } from "./dispatchers/QueriesDispatcher";

const plainHandler = async (event: APIGatewayProxyEvent, lambdaContext: Context): Promise<APIGatewayProxyResult> => {
  try {
    logger.appendKeys({ resource_path: event.requestContext.resourcePath });

    const context = extractQueriesDispatcherContext(event, lambdaContext);
    const databaseDetails = extractDatabaseDetails(process.env);

    const databaseProvider = new DatabaseProvider(databaseDetails);

    const response = await QueriesDispatcher.create(context, databaseProvider).dispatch();

    return responseBuilder(response);
  } catch (error: any) {
    logger.error("Uncaught Exception", error);
    return responseBuilder({ message: "Uncaught Exception" }, 500);
  }
};

const handler = middy(plainHandler)
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

export { handler };

import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { DispatcherContext } from "../dispatcher/Dispatcher";

export const extractDispatcherContextFromLambdaParameters = (
  event: APIGatewayProxyEvent,
  context: Context,
): DispatcherContext => {
  return {
    method: event.httpMethod,
    resource: event.resource,
    queryParameters: {
      status: event.queryStringParameters ? event.queryStringParameters["status"] : undefined,
    },
    pathParameters: {
      bookId: event.pathParameters ? event.pathParameters["bookId"] : undefined,
      userId: event.pathParameters ? event.pathParameters["userId"] : undefined,
      authorId: event.pathParameters ? event.pathParameters["authorId"] : undefined,
    },
    payload: event.body ? event.body : undefined,
    requestId: context.awsRequestId,
  };
};

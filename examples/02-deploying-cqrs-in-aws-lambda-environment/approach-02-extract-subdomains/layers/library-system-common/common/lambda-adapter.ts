import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { DatabaseDetails } from "../database/DatabaseProvider";
import { ArgumentError } from "../exceptions";

export type CommandsDispatcherContext = {
  resource: string;
  pathParameters: { bookId?: string; authorId?: string; userId?: string };
  payload?: string;
  requestId: string;
};

export const extractCommandsDispatcherContext = (
  event: APIGatewayProxyEvent,
  context: Context,
): CommandsDispatcherContext => {
  return {
    resource: event.resource,
    pathParameters: {
      bookId: event.pathParameters ? event.pathParameters["bookId"] : undefined,
      userId: event.pathParameters ? event.pathParameters["userId"] : undefined,
      authorId: event.pathParameters ? event.pathParameters["authorId"] : undefined,
    },
    payload: event.body ? event.body : undefined,
    requestId: context.awsRequestId,
  };
};

export type QueriesDispatcherContext = {
  resource: string;
  queryParameters: { status?: string };
  pathParameters: { bookId?: string; authorId?: string; userId?: string };
  requestId: string;
};

export const extractQueriesDispatcherContext = (
  event: APIGatewayProxyEvent,
  context: Context,
): QueriesDispatcherContext => {
  return {
    resource: event.resource,
    queryParameters: {
      status: event.queryStringParameters ? event.queryStringParameters["status"] : undefined,
    },
    pathParameters: {
      bookId: event.pathParameters ? event.pathParameters["bookId"] : undefined,
      userId: event.pathParameters ? event.pathParameters["userId"] : undefined,
      authorId: event.pathParameters ? event.pathParameters["authorId"] : undefined,
    },
    requestId: context.awsRequestId,
  };
};

export const extractDatabaseDetails = (environmentVariables: Record<string, string | undefined>): DatabaseDetails => {
  if (!environmentVariables["DYNAMODB_TABLE_NAME"]) {
    throw new ArgumentError("Environment variable 'DYNAMODB_TABLE_NAME' is not provided");
  }

  if (!environmentVariables["DYNAMODB_GSI1_NAME"]) {
    throw new ArgumentError("Environment variable 'DYNAMODB_GSI1_NAME' is not provided");
  }

  if (!environmentVariables["DYNAMODB_GSI2_NAME"]) {
    throw new ArgumentError("Environment variable 'DYNAMODB_GSI2_NAME' is not provided");
  }

  return {
    tableName: environmentVariables["DYNAMODB_TABLE_NAME"],
    entityTypeIndexName: environmentVariables["DYNAMODB_GSI1_NAME"],
    entityStatusIndexName: environmentVariables["DYNAMODB_GSI2_NAME"],
  };
};

import { APIGatewayProxyEvent, Context } from "aws-lambda";

import { Dispatcher } from "../src/dispatcher/Dispatcher";
import { extractDispatcherContext } from "../src/common/lambda-adapter";

import { EmptyDatabaseProvider } from "./common/EmptyDatabaseProvider";
import { Book } from "../src/models/Book";

import { AddNewBookCommandResponse } from "../src/payloads/responses";
import { BorrowBookCommandResponse } from "../src/payloads/responses";
import { ReportMissingBookCommandResponse } from "../src/payloads/responses";

import * as GetBooksByAuthorQueryPayload from "../docs/api-gateway-events/queries/GetBooksByAuthor.payload.json";
import * as GetBorrowedBooksQueryPayload from "../docs/api-gateway-events/queries/GetBorrowedBooksForUser.payload.json";
import * as GetMissingBooksQueryPayload from "../docs/api-gateway-events/queries/GetMissingBooks.payload.json";
import * as AddNewBookCommandPayload from "../docs/api-gateway-events/commands/AddNewBook.payload.json";
import * as BorrowBookCommandPayload from "../docs/api-gateway-events/commands/BorrowBook.payload.json";
import * as ReportMissingBookCommandPayload from "../docs/api-gateway-events/commands/ReportMissingBook.payload.json";

describe("Happy path tests for `entrypoint.main`", function () {
  it("Query: GetBooksByAuthor", async () => {
    const event = GetBooksByAuthorQueryPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938a" } as Context;

    const databaseProvider = new EmptyDatabaseProvider();
    const context = extractDispatcherContext(event, lambdaContext);
    const result = (await Dispatcher.create(context, databaseProvider).dispatch()) as Book[];

    expect(result.length).toEqual(0);
  });

  it("Query: GetBorrowedBooksForUser", async () => {
    const event = GetBorrowedBooksQueryPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938b" } as Context;

    const databaseProvider = new EmptyDatabaseProvider();
    const context = extractDispatcherContext(event, lambdaContext);
    const result = (await Dispatcher.create(context, databaseProvider).dispatch()) as Book[];

    expect(result.length).toEqual(0);
  });

  it("Query: GetMissingBooks", async () => {
    const event = GetMissingBooksQueryPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938c" } as Context;

    const databaseProvider = new EmptyDatabaseProvider();
    const context = extractDispatcherContext(event, lambdaContext);
    const result = (await Dispatcher.create(context, databaseProvider).dispatch()) as Book[];

    expect(result.length).toEqual(0);
  });

  it("Command: AddNewBook", async () => {
    const event = AddNewBookCommandPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938d" } as Context;

    const databaseProvider = new EmptyDatabaseProvider();
    const context = extractDispatcherContext(event, lambdaContext);
    const result = (await Dispatcher.create(context, databaseProvider).dispatch()) as AddNewBookCommandResponse;

    expect(result.success).toEqual(true);
    expect(typeof result.bookId).toEqual("string");
    expect(result.bookId?.length).toEqual(27);
  });

  it("Command: BorrowBook", async () => {
    const event = BorrowBookCommandPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938e" } as Context;

    const databaseProvider = new EmptyDatabaseProvider();
    const context = extractDispatcherContext(event, lambdaContext);
    const result = (await Dispatcher.create(context, databaseProvider).dispatch()) as BorrowBookCommandResponse;

    expect(result.success).toEqual(true);
    expect(typeof result.bookId).toEqual("string");
    expect(result.bookId?.length).toEqual(27);
  });

  it("Command: ReportMissingBook", async () => {
    const event = ReportMissingBookCommandPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938f" } as Context;

    const databaseProvider = new EmptyDatabaseProvider();
    const context = extractDispatcherContext(event, lambdaContext);
    const result = (await Dispatcher.create(context, databaseProvider).dispatch()) as ReportMissingBookCommandResponse;

    expect(result.success).toEqual(true);
    expect(typeof result.bookId).toEqual("string");
    expect(result.bookId?.length).toEqual(27);
  });
});

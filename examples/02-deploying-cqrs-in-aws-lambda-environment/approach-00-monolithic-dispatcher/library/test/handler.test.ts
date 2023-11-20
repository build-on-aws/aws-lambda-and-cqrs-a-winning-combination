import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Dispatcher } from "../src/dispatcher/Dispatcher";
import { extractDispatcherContext } from "../src/common/lambda-adapter";
import { DummyDatabaseProvider } from "./common/DummyDatabaseProvider";
import { AddNewBookCommandResponse } from "../src/payloads/responses";
import * as AddNewBookCommandPayload from "../docs/api-gateway-events/commands/AddNewBook.payload.json";

describe("Testing `entrypoint.main`", function () {
  it("Command: AddNewBook", async () => {
    const event = AddNewBookCommandPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938d" } as Context;

    const databaseProvider = new DummyDatabaseProvider();
    const context = extractDispatcherContext(event, lambdaContext);
    const result = (await Dispatcher.create(context, databaseProvider).dispatch()) as AddNewBookCommandResponse;

    expect(result.success).toEqual(true);
    expect(typeof result.bookId).toEqual("string");
    expect(result.bookId?.length).toEqual(27);
  });
});

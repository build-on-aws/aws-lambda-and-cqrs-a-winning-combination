import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Dispatcher } from "../src/dispatcher/Dispatcher";
import * as AddNewBookCommandPayload from "../docs/api-gateway-events/commands/AddNewBook.payload.json";
import { extractDispatcherContextFromLambdaParameters } from "../src/common/lambda-adapter";
import { DummyRepositoriesFactory } from "./common/DummyRepositoriesFactory";
import { AddNewBookCommandResponse } from "../src/responses/AddNewBookCommandResponse";

describe("Testing `entrypoint.main`", function () {
  it("Command: AddNewBookCommandPayload", async () => {
    const event = AddNewBookCommandPayload as unknown as APIGatewayProxyEvent;
    const lambdaContext = { awsRequestId: "88383db1-6f35-448a-a92e-a25fb66b938d" } as Context;

    const repositoriesFactory = new DummyRepositoriesFactory();
    const context = extractDispatcherContextFromLambdaParameters(event, lambdaContext);
    const result = Dispatcher.create(context, repositoriesFactory).dispatch() as AddNewBookCommandResponse;

    expect(result.success).toEqual(true);
    expect(typeof result.bookId).toEqual("string");
    expect(result.bookId?.length).toEqual(27);
  });
});

import { expect } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { main } from '../app/handler';
import * as payload from '../docs/events/api-gateway.json';

describe('Unit test for app handler', function () {
  it('verifies basic successful response', async () => {
    const event = payload as unknown;
    const result: APIGatewayProxyResult = await main(event as APIGatewayProxyEvent);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ message: 'Hello, World!' }));
  });
});

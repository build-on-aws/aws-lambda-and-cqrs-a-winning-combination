import { expect } from '@jest/globals';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { plainHandler } from '../src/handler';
import * as payload from '../docs/events/api-gateway.json';

describe('Unit test for app handler', function () {
  it('verifies basic successful response', async () => {
    const event = (payload as unknown) as APIGatewayProxyEvent;
    const result = await plainHandler(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ message: 'Hello, World!' }));
  });
});

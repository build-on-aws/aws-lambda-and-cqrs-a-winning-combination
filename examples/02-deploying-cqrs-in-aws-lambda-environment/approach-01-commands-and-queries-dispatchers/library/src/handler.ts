import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { responseBuilder } from 'commons';

export const main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.info(event);
    return responseBuilder({ message: 'Hello, World!' });
  } catch (err) {
    console.log(err);
    return responseBuilder({ message: 'Exception caught!' }, 500);
  }
};

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export const main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.info(event);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello, World!' })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Exception caught!' })
    };
  }
};

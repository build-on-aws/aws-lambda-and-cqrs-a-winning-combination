import { expect } from '@jest/globals';
import { responseBuilder } from '../index';

describe('Unit test for library-system-common layer', function () {
  it('verifies response builder', async () => {
    const result  = responseBuilder({ message: 'Hello, World!' }, 417)

    expect(result.statusCode).toEqual(417);
    expect(result.body).toEqual(JSON.stringify({ message: 'Hello, World!' }));
  });
});

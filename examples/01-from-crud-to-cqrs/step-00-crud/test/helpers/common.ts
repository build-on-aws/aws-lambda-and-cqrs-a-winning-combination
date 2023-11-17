import KSUID from 'ksuid';
import request from 'supertest';
import { app } from '../../src/server';
import { DI, init } from '../../src/server';

export const start = async () => {
  await init;
  await DI.database.createEnvironment();
};

export const stop = async () => {
  await DI.database.destroyEnvironment();
  DI.server.close();
};

const getKSUID = () => {
  return KSUID.randomSync().string;
}

export const getFakeAuthorId = () => {
  return getKSUID();
}

export const getFakeBookId = () => {
  return getKSUID();
}

export const getAgent = () => request(app);

export const getFakeAuthor = () => {
  return {
    name: 'John Doe',
    birthdate: '1975-02-15T10:10:00.000Z'
  }
};

export const getFakeUser = () => {
  return {
    name: 'James Doe',
    email: 'jd@example.com'
  }
};

export const getFakeUserWithId = () => {
  const fakeUser = getFakeUser();

  return {
    id: getKSUID(),
    ...fakeUser
  }
}

export const getFakeBook = () => {
  return {
    authorId: getFakeAuthorId(),
    title: 'Yet Another Book About Something',
    isbn: '80-902734-1-6'
  }
};

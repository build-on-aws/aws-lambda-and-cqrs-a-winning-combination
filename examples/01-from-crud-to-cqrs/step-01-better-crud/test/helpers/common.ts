import KSUID from "ksuid";
import request from "supertest";
import { app } from "../../src/server";
import { DI, init } from "../../src/server";
import { DatabaseEnvironmentProvider } from "../../src/database/DatabaseEnvironmentProvider";

const providedTableName = process.env.DYNAMODB_TABLE_NAME || null;
const databaseEnvironmentProvider = new DatabaseEnvironmentProvider(providedTableName, DI.logger);

export const start = async () => {
  await init;
  await databaseEnvironmentProvider.createEnvironment();
};

export const stop = async () => {
  await databaseEnvironmentProvider.destroyEnvironment();
  DI.server.close();
};

export const getAgent = () => request(app);

const getFakeId = () => {
  return KSUID.randomSync().string;
};

export const getFakeAuthorId = () => {
  return getFakeId();
};

export const getFakeAuthor = () => {
  return {
    name: "John Doe",
    birthdate: "1975-02-15T10:10:00.000Z",
  };
};

export const getFakeUserId = () => {
  return getFakeId();
};

export const getFakeUser = () => {
  return {
    name: "James Doe",
    email: "jd@example.com",
  };
};

export const getFakeUserWithId = () => {
  return {
    id: getFakeUserId(),
    ...getFakeUser(),
  };
};

export const getFakeBookId = () => {
  return getFakeId();
};

export const getFakeBook = () => {
  return {
    title: "Yet Another Book About Something",
    isbn: "80-902734-1-6",
  };
};

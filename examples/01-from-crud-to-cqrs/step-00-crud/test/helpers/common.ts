import request from "supertest";
import { app } from "../../src/server";
import { DI, init } from "../../src/server";

export const start = async () => {
  await init;
  await DI.database.createEnvironment();
};

export const stop = async () => {
  await DI.database.destroyEnvironment();
  DI.server.close();
};

export const getAgent = () => request(app);

export const getFakeAuthor = () => {
  return {
    name: "John Doe",
    birthdate: "1975-02-15T10:10:00.000Z"
  }
};

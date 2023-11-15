import request from "supertest";
import { expect } from "expect";
import { app, DI, init } from "../../src/server";

describe("CRUD Controller: `/author`", () => {
  beforeAll(async () => {
    await init;
  });

  afterAll(async () => {
    DI.server.close();
  });

  let id: string = "";

  const agent = request(app);

  it("Create", async () => {
    await agent
      .post("/author")
      .then(res => {
        expect(res.status).toBe(200);

        id = res.body.id;
      })
  });

  it("Read", async () => {
    await agent
      .get("/author")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });

  it("Update", async () => {
    await agent
      .put("/author/" + id)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });

  it("Delete", async () => {
    await agent
      .delete("/author/" + id)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});

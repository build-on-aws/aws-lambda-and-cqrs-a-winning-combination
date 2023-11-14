import request from "supertest";
import { expect } from "expect";
import { app, DI, init } from "../../app/server";

describe("CRUD Controller: `/user`", () => {
  beforeAll(async ()=> {
    await init;
  });

  afterAll(async () => {
    DI.server.close();
  });

  let id: string = "";

  const agent = request(app);

  it("Create", async () => {
    await agent
      .post("/user")
      .then(res => {
        expect(res.status).toBe(200);

        id = res.body.id;
      })
  });

  it("Read", async () => {
    await agent
      .get("/user")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });

  it("Update", async () => {
    await agent
      .put("/user/" + id)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });

  it("Delete", async () => {
    await agent
      .delete("/user/" + id)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});

import {getAgent, start, stop} from "../helpers/common";

describe("CRUD Controller: `/user`", () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let id: string = "";

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

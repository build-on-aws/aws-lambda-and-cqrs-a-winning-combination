import { start, stop, getAgent } from "../helpers/common";

describe("CRUD Controller: `/book`", () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let id: string = "";

  it("Create", async () => {
    await agent
      .post("/book")
      .then(res => {
        expect(res.status).toBe(200);

        id = res.body.id;
      })
  });

  it("Read", async () => {
    await agent
      .get("/book")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });

  it("Update", async () => {
    await agent
      .put("/book/" + id)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });

  it("Delete", async () => {
    await agent
      .delete("/book/" + id)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});

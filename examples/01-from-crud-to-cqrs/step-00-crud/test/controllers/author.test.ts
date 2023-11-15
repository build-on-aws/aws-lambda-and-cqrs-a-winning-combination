import { getAgent, getFakeAuthor, start, stop } from "../helpers/common";

describe("CRUD Controller: `/author`", () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let id: string = "";
  const author = getFakeAuthor();

  it("Create", async () => {
    await agent
      .post("/author")
      .set('Content-Type', 'application/json')
      .send(author)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(author.name);
        expect(res.body.birthdate).toBe(author.birthdate);

        id = res.body.id;
      })
  });

  it("Read All", async () => {
    await agent
      .get("/author")
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(id);
        expect(res.body[0].name).toBe(author.name);
        expect(res.body[0].birthdate).toBe(author.birthdate);
      });
  });

  it("Read", async () => {
    await agent
      .get("/author/" + id)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(author.name);
        expect(res.body.birthdate).toBe(author.birthdate);
      });
  });

  it("Update", async () => {
    author.name = "Jane Doe";
    author.birthdate = "1980-02-16T11:11:11.000Z";

    await agent
      .put("/author/" + id)
      .send(author)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(author.name);
        expect(res.body.birthdate).toBe(author.birthdate);
      });
  });

  it("Delete", async () => {
    await agent
      .delete("/author/" + id)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
      });
  });

  it("Read All, but this time empty collection", async () => {
    await agent
      .get("/author")
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
      });
  });
});

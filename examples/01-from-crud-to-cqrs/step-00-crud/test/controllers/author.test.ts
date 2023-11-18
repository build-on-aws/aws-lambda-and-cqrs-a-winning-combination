import { getAgent, getFakeAuthor, getFakeAuthorId, start, stop } from "../helpers/common";

describe("CRUD Controller: /author", () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let id: string = "";
  const author = getFakeAuthor();

  it("Verifying validation during creation", async () => {
    await agent
      .post("/author")
      .set("Content-Type", "application/json")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Create", async () => {
    await agent
      .post("/author")
      .set("Content-Type", "application/json")
      .send(author)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(author.name);
        expect(res.body.birthdate).toBe(author.birthdate);

        id = res.body.id;
      });
  });

  it("Read all", async () => {
    await agent.get("/author").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(id);
      expect(res.body[0].name).toBe(author.name);
      expect(res.body[0].birthdate).toBe(author.birthdate);
    });
  });

  it("Read", async () => {
    await agent.get(`/author/${id}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.name).toBe(author.name);
      expect(res.body.birthdate).toBe(author.birthdate);
    });
  });

  it("Read, but not found", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent.get(`/author/${nonExistingId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Update", async () => {
    const updatedAuthor = {
      name: "Jane Doe",
      birthdate: "1980-02-16T11:11:11.000Z",
    };

    await agent
      .put(`/author/${id}`)
      .send(updatedAuthor)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(updatedAuthor.name);
        expect(res.body.birthdate).toBe(updatedAuthor.birthdate);

        author.name = updatedAuthor.name;
        author.birthdate = updatedAuthor.birthdate;
      });
  });

  it("Update, but not all fields", async () => {
    const updatedAuthor = {
      name: "Jane Doe",
    };

    await agent
      .put(`/author/${id}`)
      .send(updatedAuthor)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(updatedAuthor.name);
        expect(res.body.birthdate).toBe(author.birthdate);

        author.name = updatedAuthor.name;
      });
  });

  it("Update, but not found", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent
      .put(`/author/${nonExistingId}`)
      .send({ name: "John Test" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("Update, but with no fields for update provided", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent
      .put(`/author/${nonExistingId}`)
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Delete", async () => {
    await agent.delete(`/author/${id}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
    });
  });

  it("Delete, but not found", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent.delete(`/author/${nonExistingId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Read all, but this time empty collection", async () => {
    await agent.get("/author").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

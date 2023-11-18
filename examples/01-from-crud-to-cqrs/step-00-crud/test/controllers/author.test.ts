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

  it("Create author", async () => {
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

  it("Get all authors", async () => {
    await agent.get("/author").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(id);
      expect(res.body[0].name).toBe(author.name);
      expect(res.body[0].birthdate).toBe(author.birthdate);
    });
  });

  it("Get author", async () => {
    await agent.get(`/author/${id}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.name).toBe(author.name);
      expect(res.body.birthdate).toBe(author.birthdate);
    });
  });

  it("Get author, but entity not found", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent.get(`/author/${nonExistingId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Update author", async () => {
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

  it("Update author, but not all fields", async () => {
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

  it("Update author, but entity not found", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent
      .put(`/author/${nonExistingId}`)
      .send({ name: "John Test" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("Update author, but with no fields for update provided", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent
      .put(`/author/${nonExistingId}`)
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Delete author", async () => {
    await agent.delete(`/author/${id}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
    });
  });

  it("Delete author, but entity not found", async () => {
    const nonExistingId = getFakeAuthorId();

    await agent.delete(`/author/${nonExistingId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Get all authors, but this time empty collection", async () => {
    await agent.get("/author").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

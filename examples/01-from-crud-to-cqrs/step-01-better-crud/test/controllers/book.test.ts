import { BookStatus } from "../../src/model/Book";
import { getAgent, getFakeAuthorId, getFakeBook, start, stop } from "../helpers/common";

describe("CRUD Controller: /book", () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let bookId: string = "";
  const book: { title: string; isbn: string; status?: BookStatus } = getFakeBook();
  const authorId = getFakeAuthorId();

  it("Verifying validation during creation", async () => {
    await agent
      .post(`/book/${authorId}`)
      .set("Content-Type", "application/json")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Create book", async () => {
    await agent
      .post(`/book/${authorId}`)
      .set("Content-Type", "application/json")
      .send(book)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.authorId).toBe(authorId);
        expect(res.body.title).toBe(book.title);
        expect(res.body.isbn).toBe(book.isbn);
        expect(res.body.status).toBe(BookStatus.NOT_AVAILABLE);

        bookId = res.body.bookId;
      });
  });

  it("Get all books", async () => {
    await agent.get("/book").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].bookId).toBe(bookId);
      expect(res.body[0].authorId).toBe(authorId);
      expect(res.body[0].title).toBe(book.title);
      expect(res.body[0].isbn).toBe(book.isbn);
      expect(res.body[0].status).toBe(BookStatus.NOT_AVAILABLE);
    });
  });

  it("Get all books for a given author", async () => {
    await agent.get(`/book/${authorId}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].bookId).toBe(bookId);
      expect(res.body[0].authorId).toBe(authorId);
      expect(res.body[0].title).toBe(book.title);
      expect(res.body[0].isbn).toBe(book.isbn);
      expect(res.body[0].status).toBe(BookStatus.NOT_AVAILABLE);
    });
  });

  it("Get book", async () => {
    await agent.get(`/book/${authorId}/${bookId}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.bookId).toBe(bookId);
      expect(res.body.authorId).toBe(authorId);
      expect(res.body.title).toBe(book.title);
      expect(res.body.isbn).toBe(book.isbn);
      expect(res.body.status).toBe(BookStatus.NOT_AVAILABLE);
    });
  });

  it("Get book, but entity not found", async () => {
    const nonExistingAuthorId = getFakeAuthorId();

    await agent.get(`/book/${nonExistingAuthorId}/${bookId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Update book", async () => {
    const bookUpdate = {
      title: "Yet Another Changed Title",
      isbn: "960-425-059-0",
      status: "MISSING",
    };

    await agent
      .put(`/book/${authorId}/${bookId}`)
      .send(bookUpdate)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.authorId).toBe(authorId);
        expect(res.body.title).toBe(bookUpdate.title);
        expect(res.body.isbn).toBe(bookUpdate.isbn);
        expect(res.body.status).toBe(BookStatus.MISSING);

        book.title = bookUpdate.title;
        book.isbn = bookUpdate.isbn;
        book.status = BookStatus.MISSING;
      });
  });

  it("Get all books filtered by status", async () => {
    await agent.get(`/book/?status=MISSING`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].bookId).toBe(bookId);
      expect(res.body[0].authorId).toBe(authorId);
      expect(res.body[0].title).toBe(book.title);
      expect(res.body[0].isbn).toBe(book.isbn);
      expect(res.body[0].status).toBe(BookStatus.MISSING);
    });

    await agent.get(`/book/?status=AVAILABLE`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    await agent.get(`/book/?status=NOT_AVAILABLE`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  it("Update book, but not all fields", async () => {
    const bookUpdate = {
      title: "Yet Another Changed Title",
    };

    await agent
      .put(`/book/${authorId}/${bookId}`)
      .send(bookUpdate)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.authorId).toBe(authorId);
        expect(res.body.title).toBe(bookUpdate.title);
        expect(res.body.isbn).toBe(book.isbn);
        expect(res.body.status).toBe(book.status);

        book.title = bookUpdate.title;
      });
  });

  it("Update book, but entity not found", async () => {
    const nonExistingAuthorId = getFakeAuthorId();

    await agent
      .put(`/book/${nonExistingAuthorId}/${bookId}`)
      .send({ title: "Testing Title" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("Update book, but with no fields for update provided", async () => {
    const nonExistingAuthorId = getFakeAuthorId();

    await agent
      .put(`/book/${nonExistingAuthorId}/${bookId}`)
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Delete book", async () => {
    await agent.delete(`/book/${authorId}/${bookId}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.bookId).toBe(bookId);
      expect(res.body.authorId).toBe(authorId);
    });
  });

  it("Delete book, but entity not found", async () => {
    const nonExistingAuthorId = getFakeAuthorId();

    await agent.delete(`/book/${nonExistingAuthorId}/${bookId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Get all books, but this time empty collection", async () => {
    await agent.get("/book").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

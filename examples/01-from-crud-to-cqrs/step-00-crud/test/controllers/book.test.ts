import { BookStatus } from "../../src/model/Book";
import { getAgent, getFakeBook, start, stop } from '../helpers/common';

describe('CRUD Controller: /book', () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let id: string = '';
  const book = getFakeBook();
  const authorId = book.authorId;

  it('Verifying validation during creation', async () => {
    await agent
      .post('/book')
      .set('Content-Type', 'application/json')
      .send({})
      .then(res => {
        expect(res.status).toBe(400);
      });
  });

  it('Create', async () => {
    await agent
      .post('/book')
      .set('Content-Type', 'application/json')
      .send(book)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.authorId).toBe(authorId);
        expect(res.body.title).toBe(book.title);
        expect(res.body.isbn).toBe(book.isbn);
        expect(res.body.status).toBe(BookStatus.AVAILABLE);

        id = res.body.id;
      });
  });

  it('Read all', async () => {
    await agent
      .get('/book')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(id);
        expect(res.body[0].authorId).toBe(authorId);
        expect(res.body[0].title).toBe(book.title);
        expect(res.body[0].isbn).toBe(book.isbn);
        expect(res.body[0].status).toBe(BookStatus.AVAILABLE);
      });
  });

  it('Read', async () => {
    await agent
      .get('/book/' + id)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.title).toBe(book.title);
        expect(res.body.isbn).toBe(book.isbn);
        expect(res.body.authorId).toBe(authorId);
        expect(res.body.status).toBe(BookStatus.AVAILABLE);
      });
  });

  it('Update', async () => {
    const bookUpdate = {
      title: 'Yet Another Changed Title',
      isbn: '960-425-059-0',
      status: 'MISSING'
    };

    await agent
      .put('/book/' + id)
      .send(bookUpdate)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.authorId).toBe(authorId);
        expect(res.body.title).toBe(bookUpdate.title);
        expect(res.body.isbn).toBe(bookUpdate.isbn);
        expect(res.body.status).toBe(BookStatus.MISSING);
      });
  });

  it('Delete', async () => {
    await agent
      .delete('/book/' + id)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
      });
  });

  it('Read all, but this time empty collection', async () => {
    await agent
      .get('/book')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
      });
  });
});

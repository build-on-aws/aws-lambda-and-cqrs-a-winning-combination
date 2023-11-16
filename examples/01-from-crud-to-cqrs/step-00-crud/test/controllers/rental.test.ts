import { RentalStatus } from "../../src/model/Rental";
import { getAgent, getFakeBookId, getFakeUserWithId, start, stop } from '../helpers/common';

describe('CRUD Controller: /rental', () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  const user = getFakeUserWithId();
  const bookId = getFakeBookId();

  it('Verifying validation during creation', async () => {
    await agent
      .post('/rental/for-user/' + user.id + '/' + bookId)
      .set('Content-Type', 'application/json')
      .send({})
      .then(res => {
        expect(res.status).toBe(400);
      });
  });

  it('Create', async () => {
    await agent
      .post('/rental/for-user/' + user.id + '/' + bookId)
      .set('Content-Type', 'application/json')
      .send(user)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(user.id);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(user.email);
        expect(res.body.status).toBe(RentalStatus.BORROWED);
        expect(res.body.comment).toBe("");
      });
  });

  it('Read all', async () => {
    await agent
      .get('/rental')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].userId).toBe(user.id);
        expect(res.body[0].bookId).toBe(bookId);
        expect(res.body[0].name).toBe(user.name);
        expect(res.body[0].email).toBe(user.email);
        expect(res.body[0].status).toBe(RentalStatus.BORROWED);
        expect(res.body[0].comment).toBe("");
      });
  });

  it('Read', async () => {
    await agent
      .get('/rental/for-user/' + user.id + '/' + bookId)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(user.id);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(user.email);
        expect(res.body.status).toBe(RentalStatus.BORROWED);
        expect(res.body.comment).toBe("");
      });
  });

  it('Update', async () => {
    const rentalUpdate = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      status: 'RETURNED',
      comment: 'This is a comment'
    };

    await agent
      .put('/rental/for-user/' + user.id + '/' + bookId)
      .send(rentalUpdate)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(user.id);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.name).toBe(rentalUpdate.name);
        expect(res.body.email).toBe(rentalUpdate.email);
        expect(res.body.status).toBe(RentalStatus.RETURNED);
        expect(res.body.comment).toBe(rentalUpdate.comment);
      });
  });

  it('Delete', async () => {
    await agent
      .delete('/rental/for-user/' + user.id + '/' + bookId)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(user.id);
        expect(res.body.bookId).toBe(bookId);
      });
  });

  it('Read all, but this time empty collection', async () => {
    await agent
      .get('/rental')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
      });
  });
});

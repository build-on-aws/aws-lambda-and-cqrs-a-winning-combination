import { UserStatus } from "../../src/model/User";
import { getAgent, getFakeUser, start, stop } from '../helpers/common';

describe('CRUD Controller: /user', () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let id: string = '';
  const user = getFakeUser();

  it('Verifying validation during creation', async () => {
    await agent
      .post('/user')
      .set('Content-Type', 'application/json')
      .send({})
      .then(res => {
        expect(res.status).toBe(400);
      });
  });

  it('Create', async () => {
    await agent
      .post('/user')
      .set('Content-Type', 'application/json')
      .send(user)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(user.email);
        expect(res.body.status).toBe(UserStatus.NOT_VERIFIED);
        expect(res.body.comment).toBe("");

        id = res.body.id;
      });
  });

  it('Read all', async () => {
    await agent
      .get('/user')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(id);
        expect(res.body[0].name).toBe(user.name);
        expect(res.body[0].email).toBe(user.email);
        expect(res.body[0].status).toBe(UserStatus.NOT_VERIFIED);
        expect(res.body[0].comment).toBe("");
      });
  });

  it('Read', async () => {
    await agent
      .get('/user/' + id)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(user.email);
        expect(res.body.status).toBe(UserStatus.NOT_VERIFIED);
        expect(res.body.comment).toBe("");
      });
  });

  it('Update', async () => {
    const userUpdate = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      status: 'VERIFIED',
      comment: 'This is a comment.'
    }

    await agent
      .put('/user/' + id)
      .send(userUpdate)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(userUpdate.name);
        expect(res.body.email).toBe(userUpdate.email);
        expect(res.body.status).toBe(UserStatus.VERIFIED);
        expect(res.body.comment).toBe(userUpdate.comment);
      });
  });

  it('Delete', async () => {
    await agent
      .delete('/user/' + id)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
      });
  });

  it('Read all, but this time empty collection', async () => {
    await agent
      .get('/user')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
      });
  });
});

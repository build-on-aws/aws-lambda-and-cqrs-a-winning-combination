import { UserStatus } from "../../src/model/User";
import { getAgent, getFakeUser, getFakeUserId, start, stop } from "../helpers/common";

describe("CRUD Controller: /user", () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  let id: string = "";
  const user: { name: string; email: string; status?: UserStatus; comment?: string } = getFakeUser();

  it("Verifying validation during creation", async () => {
    await agent
      .post("/user")
      .set("Content-Type", "application/json")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Create user", async () => {
    await agent
      .post("/user")
      .set("Content-Type", "application/json")
      .send(user)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(user.email);
        expect(res.body.status).toBe(UserStatus.NOT_VERIFIED);
        expect(res.body.comment).toBe("");

        id = res.body.id;
      });
  });

  it("Get all users", async () => {
    await agent.get("/user").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(id);
      expect(res.body[0].name).toBe(user.name);
      expect(res.body[0].email).toBe(user.email);
      expect(res.body[0].status).toBe(UserStatus.NOT_VERIFIED);
      expect(res.body[0].comment).toBe("");
    });
  });

  it("Get user", async () => {
    await agent.get(`/user/${id}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.name).toBe(user.name);
      expect(res.body.email).toBe(user.email);
      expect(res.body.status).toBe(UserStatus.NOT_VERIFIED);
      expect(res.body.comment).toBe("");
    });
  });

  it("Get user, but entity not found", async () => {
    const nonExistingId = getFakeUserId();

    await agent.get(`/user/${nonExistingId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Update user", async () => {
    const userUpdate = {
      name: "Jane Doe",
      email: "update+test@example.com",
      status: "VERIFIED",
      comment: "This is a comment.",
    };

    await agent
      .put(`/user/${id}`)
      .send(userUpdate)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(userUpdate.name);
        expect(res.body.email).toBe(userUpdate.email);
        expect(res.body.status).toBe(UserStatus.VERIFIED);
        expect(res.body.comment).toBe(userUpdate.comment);

        user.name = userUpdate.name;
        user.email = userUpdate.email;
        user.status = UserStatus.VERIFIED;
        user.comment = userUpdate.comment;
      });
  });

  it("Update user, but not all fields", async () => {
    const userUpdate = {
      name: "Jane Foe",
    };

    await agent
      .put(`/user/${id}`)
      .send(userUpdate)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.name).toBe(userUpdate.name);
        expect(res.body.email).toBe(user.email);
        expect(res.body.status).toBe(user.status);
        expect(res.body.comment).toBe(user.comment);

        user.name = userUpdate.name;
      });
  });

  it("Update user, but entity not found", async () => {
    const nonExistingId = getFakeUserId();

    await agent
      .put(`/user/${nonExistingId}`)
      .send({ name: "John Test" })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("Update user, but with no fields for update provided", async () => {
    const nonExistingId = getFakeUserId();

    await agent
      .put(`/user/${nonExistingId}`)
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Delete user", async () => {
    await agent.delete(`/user/${id}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
    });
  });

  it("Delete user, but entity not found", async () => {
    const nonExistingId = getFakeUserId();

    await agent.delete(`/user/${nonExistingId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Get all users, but this time empty collection", async () => {
    await agent.get("/user").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

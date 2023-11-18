import { RentalStatus } from "../../src/model/Rental";
import { getAgent, getFakeBookId, getFakeUserId, getFakeUserWithId, start, stop } from "../helpers/common";

describe("CRUD Controller: /rental", () => {
  beforeAll(start);
  afterAll(stop);

  const agent = getAgent();

  const user = getFakeUserWithId();
  const bookId = getFakeBookId();
  const rental: { status?: RentalStatus; comment?: string } = {};

  it("Create", async () => {
    await agent
      .post(`/rental/${user.id}/${bookId}`)
      .set("Content-Type", "application/json")
      .send({})
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(user.id);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.status).toBe(RentalStatus.BORROWED);
        expect(res.body.comment).toBe("");
      });
  });

  it("Read all", async () => {
    await agent.get("/rental").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].userId).toBe(user.id);
      expect(res.body[0].bookId).toBe(bookId);
      expect(res.body[0].status).toBe(RentalStatus.BORROWED);
      expect(res.body[0].comment).toBe("");
    });
  });

  it("Read all rentals for a given user", async () => {
    await agent.get(`/rental/${user.id}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].userId).toBe(user.id);
      expect(res.body[0].bookId).toBe(bookId);
      expect(res.body[0].status).toBe(RentalStatus.BORROWED);
      expect(res.body[0].comment).toBe("");
    });
  });

  it("Read", async () => {
    await agent.get(`/rental/${user.id}/${bookId}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.userId).toBe(user.id);
      expect(res.body.bookId).toBe(bookId);
      expect(res.body.status).toBe(RentalStatus.BORROWED);
      expect(res.body.comment).toBe("");
    });
  });

  it("Read, but not found", async () => {
    const nonExistingUserId = getFakeUserId();

    await agent.get(`/rental/${nonExistingUserId}/${bookId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Update", async () => {
    const rentalUpdate = {
      status: "RETURNED",
      comment: "This is a comment",
    };

    await agent
      .put(`/rental/${user.id}/${bookId}`)
      .send(rentalUpdate)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(user.id);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.status).toBe(RentalStatus.RETURNED);
        expect(res.body.comment).toBe(rentalUpdate.comment);

        rental.status = RentalStatus.RETURNED;
        rental.comment = rentalUpdate.comment;
      });
  });

  it("Update, but not all fields", async () => {
    const rentalUpdate = {
      comment: "This is a comment",
    };

    await agent
      .put(`/rental/${user.id}/${bookId}`)
      .send(rentalUpdate)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(user.id);
        expect(res.body.bookId).toBe(bookId);
        expect(res.body.status).toBe(RentalStatus.RETURNED);
        expect(res.body.comment).toBe(rentalUpdate.comment);

        rental.comment = rentalUpdate.comment;
      });
  });

  it("Update, but not found", async () => {
    const nonExistingUserId = getFakeUserId();

    await agent
      .put(`/rental/${nonExistingUserId}/${bookId}`)
      .send({ comment: "Testing comment." })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("Update, but with no fields for update provided", async () => {
    const nonExistingUserId = getFakeUserId();

    await agent
      .put(`/rental/${nonExistingUserId}/${bookId}`)
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("Delete", async () => {
    await agent.delete(`/rental/${user.id}/${bookId}`).then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.userId).toBe(user.id);
      expect(res.body.bookId).toBe(bookId);
    });
  });

  it("Delete, but not found", async () => {
    const nonExistingUserId = getFakeUserId();

    await agent.delete(`/rental/${nonExistingUserId}/${bookId}`).then((res) => {
      expect(res.status).toBe(404);
    });
  });

  it("Read all, but this time empty collection", async () => {
    await agent.get("/rental").then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

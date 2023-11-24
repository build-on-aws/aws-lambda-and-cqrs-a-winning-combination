import Router from "express-promise-router";
import { Request, Response } from "express";
import { extractPaginationDetails } from "../common/controllers";
import { NotFoundError } from "../exceptions/NotFoundError";
import { DI } from "../server";
import { Rental, RentalModel } from "../model/Rental";
import { ByType, ByTypeAndSortKey, Index } from "../database/DatabaseActionsProvider";

const router = Router();

// Create.

router.post("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const payload = req.body;

  const mapper = Rental.fromPayloadForCreate(bookId, userId, payload);

  const result = await DI.database.actions.put(mapper.toModel());

  res.json(Rental.fromModel(result as RentalModel).toMapping());
});

// Read (All).

router.get("/", async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req);

  const collection = await DI.database.actions.query(ByType("Rental"), Index.TYPE, pagination);

  res.json(collection.map((entity) => Rental.fromModel(entity as RentalModel).toMapping()));
});

// Read (All Rentals for User).

router.get("/:userId", async (req: Request<{ userId: string }>, res: Response) => {
  const userId = req.params.userId;
  const pagination = extractPaginationDetails(req);

  const collection = await DI.database.actions.query(
    ByTypeAndSortKey("Rental", `User#${userId}`),
    Index.TYPE,
    pagination,
  );

  res.json(collection.map((entity) => Rental.fromModel(entity as RentalModel).toMapping()));
});

// Read (One).

router.get("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const mapper = Rental.fromId(bookId, userId);

  const result = await DI.database.actions.get(mapper.toKey());

  if (!result) {
    throw new NotFoundError("Rental");
  }

  res.json(Rental.fromModel(result as RentalModel).toMapping());
});

// Update.

router.put("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const payload = req.body;
  const mapper = Rental.fromPayloadForUpdate(bookId, userId, payload);

  const result = await DI.database.actions.update(mapper.toKey(), mapper.toUpdate());

  if (!result) {
    throw new NotFoundError("Rental");
  }

  res.json(Rental.fromModel(result as RentalModel).toMapping());
});

// Delete.

router.delete("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const mapper = Rental.fromId(bookId, userId);

  const result = await DI.database.actions.delete(mapper.toKey());

  if (!result) {
    throw new NotFoundError("Rental");
  }

  res.json(mapper.emptyMapping());
});

export const RentalController = router;

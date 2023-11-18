import Router from "express-promise-router";
import { Request, Response } from "express";
import { extractPaginationDetails } from "../common/controllers";
import { NotFoundError } from "../exceptions/NotFoundError";
import { DI } from "../server";
import { User, UserModel } from "../model/User";
import { ByType } from "../database/DatabaseActionsProvider";

const router = Router();

// Create.

router.post("/", async (req: Request, res: Response) => {
  const payload = req.body;
  const mapper = User.fromPayloadForCreate(payload);

  const result = await DI.database.actions.put(mapper.toModel());

  res.json(User.fromModel(result as UserModel).toMapping());
});

// Read (All).

router.get("/", async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req);

  const collection = await DI.database.actions.queryWithIndex(ByType("User"), pagination);

  res.json(collection.map((entity) => User.fromModel(entity as UserModel).toMapping()));
});

// Read (One).

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const mapper = User.fromId(id);

  const result = await DI.database.actions.get(mapper.toKey());

  if (!result) {
    throw new NotFoundError("User");
  }

  res.json(User.fromModel(result as UserModel).toMapping());
});

// Update.

router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const mapper = User.fromPayloadForUpdate(id, payload);

  const result = await DI.database.actions.update(mapper.toKey(), mapper.toUpdate());

  if (!result) {
    throw new NotFoundError("User");
  }

  res.json(User.fromModel(result as UserModel).toMapping());
});

// Delete.

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const mapper = User.fromId(id);

  const result = await DI.database.actions.delete(mapper.toKey());

  if (!result) {
    throw new NotFoundError("User");
  }

  res.json(mapper.emptyMapping());
});

export const UserController = router;

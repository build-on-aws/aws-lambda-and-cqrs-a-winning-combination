import Router from "express-promise-router";
import { Request, Response } from "express";
import { extractPaginationDetails } from "../common/controllers";
import { NotFoundError } from "../exceptions/NotFoundError";
import { DI } from "../server";
import { Author, AuthorModel } from "../model/Author";
import { ByType } from "../database/DatabaseActionsProvider";

const router = Router();

// Create.

router.post("/", async (req: Request, res: Response) => {
  const payload = req.body;
  const mapper = Author.fromPayload(payload);

  const result = await DI.database.actions.put(mapper.toModel());

  res.json(Author.fromModel(result as AuthorModel).toMapping());
});

// Read (All).

router.get("/", async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req);

  const collection = await DI.database.actions.queryWithIndex(ByType("Author"), pagination);

  if (!collection) {
    throw new NotFoundError("Author");
  }

  res.json(collection.map((entity) => Author.fromModel(entity as AuthorModel).toMapping()));
});

// Read (One).

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const mapper = Author.fromId(id);

  const result = await DI.database.actions.get(mapper.toKey());

  if (!result) {
    throw new NotFoundError("Author");
  }

  res.json(Author.fromModel(result as AuthorModel).toMapping());
});

// Update.

router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const mapper = Author.fromPayloadForUpdate(id, payload);

  const result = await DI.database.actions.update(mapper.toKey(), mapper.toUpdate());

  if (!result) {
    throw new NotFoundError("Author");
  }

  res.json(Author.fromModel(result as AuthorModel).toMapping());
});

// Delete.

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const mapper = Author.fromId(id);

  const result = await DI.database.actions.delete(mapper.toKey());

  if (!result) {
    throw new NotFoundError("Author");
  }

  res.json(mapper.emptyMapping());
});

export const AuthorController = router;

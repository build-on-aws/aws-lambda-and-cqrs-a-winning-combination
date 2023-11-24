import Router from "express-promise-router";
import { Request, Response } from "express";
import { extractPaginationDetails, extractFiltering } from "../common/controllers";
import { NotFoundError } from "../exceptions/NotFoundError";
import { DI } from "../server";
import { Book, BookModel } from "../model/Book";
import { ByType, ByTypeAndSortKey, ByTypeAndStatus, Index } from "../database/DatabaseActionsProvider";

const router = Router();

// Create.

router.post("/:authorId", async (req: Request<{ authorId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const payload = req.body;
  const mapper = Book.fromPayloadForCreate(authorId, payload);

  const result = await DI.database.actions.put(mapper.toModel());

  res.json(Book.fromModel(result as BookModel).toMapping());
});

// Read (All).

router.get("/", async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req);
  const filterByStatus = extractFiltering(req, "status");

  const collection = filterByStatus
    ? await DI.database.actions.query(ByTypeAndStatus("Book", filterByStatus.value), Index.STATUS, pagination)
    : await DI.database.actions.query(ByType("Book"), Index.TYPE, pagination);

  res.json(collection.map((entity) => Book.fromModel(entity as BookModel).toMapping()));
});

// Read (All Books for Author).

router.get("/:authorId", async (req: Request<{ authorId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const pagination = extractPaginationDetails(req);

  const collection = await DI.database.actions.query(
    ByTypeAndSortKey("Book", `Author#${authorId}`),
    Index.TYPE,
    pagination,
  );

  res.json(collection.map((entity) => Book.fromModel(entity as BookModel).toMapping()));
});

// Read (One).

router.get("/:authorId/:bookId", async (req: Request<{ authorId: string; bookId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const bookId = req.params.bookId;
  const mapper = Book.fromId(bookId, authorId);

  const result = await DI.database.actions.get(mapper.toKey());

  if (!result) {
    throw new NotFoundError("Book");
  }

  res.json(Book.fromModel(result as BookModel).toMapping());
});

// Update.

router.put("/:authorId/:bookId", async (req: Request<{ authorId: string; bookId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const bookId = req.params.bookId;
  const payload = req.body;
  const mapper = Book.fromPayloadForUpdate(bookId, authorId, payload);

  const result = await DI.database.actions.update(mapper.toKey(), mapper.toUpdate());

  if (!result) {
    throw new NotFoundError("Book");
  }

  res.json(Book.fromModel(result as BookModel).toMapping());
});

// Delete.

router.delete("/:authorId/:bookId", async (req: Request<{ authorId: string; bookId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const bookId = req.params.bookId;
  const mapper = Book.fromId(bookId, authorId);

  const result = await DI.database.actions.delete(mapper.toKey());

  if (!result) {
    throw new NotFoundError("Book");
  }

  res.json(mapper.emptyMapping());
});

export const BookController = router;

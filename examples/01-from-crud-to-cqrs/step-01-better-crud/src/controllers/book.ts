import KSUID from "ksuid";
import Router from "express-promise-router";
import { Request, Response } from "express";
import { extractFiltering, extractPaginationDetails } from "../common/controllers";
import { BookRequestPayload, BookStatus, BookUpdateModel } from "../models/Book";
import { BookRepository } from "../repositories";
import { DI } from "../server";

const router = Router();

// Create.

router.post("/:authorId", async (req: Request<{ authorId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const payload = req.body;
  const request = payload as BookRequestPayload;

  const repository = DI.repositoriesFactory.createRepositoryFor("Book") as BookRepository;
  const result = await repository.create({
    bookId: KSUID.randomSync().string,
    authorId,
    title: request.title,
    isbn: request.isbn,
    status: BookStatus.NOT_AVAILABLE,
  });

  res.json(result);
});

// Read (All).

router.get("/", async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req);
  const filterByStatus = extractFiltering(req, "status");

  const repository = DI.repositoriesFactory.createRepositoryFor("Book") as BookRepository;
  const collection = filterByStatus
    ? await repository.queryByTypeAndStatus("Book", filterByStatus.value, pagination)
    : await repository.queryByTypeAndSortKey("Book", "", pagination);

  res.json(collection);
});

// Read (All Books for Author).

router.get("/:authorId", async (req: Request<{ authorId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const pagination = extractPaginationDetails(req);

  const repository = DI.repositoriesFactory.createRepositoryFor("Book") as BookRepository;
  const collection = await repository.queryByTypeAndSortKey("Book", `Author#${authorId}`, pagination);

  res.json(collection);
});

// Read (One).

router.get("/:authorId/:bookId", async (req: Request<{ authorId: string; bookId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const bookId = req.params.bookId;

  const repository = DI.repositoriesFactory.createRepositoryFor("Book") as BookRepository;
  const result = await repository.read({ bookId, authorId });

  res.json(result);
});

// Update.

router.put("/:authorId/:bookId", async (req: Request<{ authorId: string; bookId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const bookId = req.params.bookId;
  const payload = req.body;
  const request = payload as BookUpdateModel;

  const repository = DI.repositoriesFactory.createRepositoryFor("Book") as BookRepository;
  const result = await repository.update({ bookId, authorId }, request);

  res.json(result);
});

// Delete.

router.delete("/:authorId/:bookId", async (req: Request<{ authorId: string; bookId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const bookId = req.params.bookId;

  const repository = DI.repositoriesFactory.createRepositoryFor("Book") as BookRepository;
  const result = await repository.delete({ bookId, authorId });

  res.json(result);
});

export const BookController = router;

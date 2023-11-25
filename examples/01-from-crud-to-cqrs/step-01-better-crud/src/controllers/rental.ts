import Router from "express-promise-router";
import { Request, Response } from "express";
import { extractPaginationDetails } from "../common/controllers";
import { RentalStatus, RentalUpdateModel } from "../models/Rental";
import { RentalRepository } from "../repositories";
import { DI } from "../server";

const router = Router();

// Create.

router.post("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  const repository = DI.repositoriesFactory.createRepositoryFor("Rental") as RentalRepository;
  const result = await repository.create({
    bookId,
    userId,
    status: RentalStatus.BORROWED,
    comment: "",
  });

  res.json(result);
});

// Read (All).

router.get("/", async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req);

  const repository = DI.repositoriesFactory.createRepositoryFor("Rental") as RentalRepository;
  const collection = await repository.queryByTypeAndSortKey("Rental", "", pagination);

  res.json(collection);
});

// Read (All Rentals for User).

router.get("/:userId", async (req: Request<{ userId: string }>, res: Response) => {
  const userId = req.params.userId;
  const pagination = extractPaginationDetails(req);

  const repository = DI.repositoriesFactory.createRepositoryFor("Rental") as RentalRepository;
  const collection = await repository.queryByTypeAndSortKey("Rental", `User#${userId}`, pagination);

  res.json(collection);
});

// Read (One).

router.get("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  const repository = DI.repositoriesFactory.createRepositoryFor("Rental") as RentalRepository;
  const result = await repository.read({ bookId, userId });

  res.json(result);
});

// Update.

router.put("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const payload = req.body;
  const request = payload as RentalUpdateModel;

  const repository = DI.repositoriesFactory.createRepositoryFor("Rental") as RentalRepository;
  const result = await repository.update({ bookId, userId }, request);

  res.json(result);
});

// Delete.

router.delete("/:userId/:bookId", async (req: Request<{ userId: string; bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  const repository = DI.repositoriesFactory.createRepositoryFor("Rental") as RentalRepository;
  const result = await repository.delete({ bookId, userId });

  res.json(result);
});

export const RentalController = router;

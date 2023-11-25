import KSUID from "ksuid";
import Router from "express-promise-router";
import { Request, Response } from "express";
import { extractPaginationDetails } from "../common/controllers";
import { UserRequestPayload, UserStatus, UserUpdateModel } from "../models/User";
import { UserRepository } from "../repositories";
import { DI } from "../server";

const router = Router();

// Create.

router.post("/", async (req: Request, res: Response) => {
  const payload = req.body;
  const request = payload as UserRequestPayload;

  const repository = DI.repositoriesFactory.createRepositoryFor("User") as UserRepository;
  const result = await repository.create({
    id: KSUID.randomSync().string,
    name: request.name,
    email: request.email,
    status: UserStatus.NOT_VERIFIED,
    comment: "",
  });

  res.json(result);
});

// Read (All).

router.get("/", async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req);

  const repository = DI.repositoriesFactory.createRepositoryFor("User") as UserRepository;
  const collection = await repository.queryByTypeAndSortKey("User", "", pagination);

  res.json(collection);
});

// Read (One).

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;

  const repository = DI.repositoriesFactory.createRepositoryFor("User") as UserRepository;
  const result = await repository.read({ id });

  res.json(result);
});

// Update.

router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const request = payload as UserUpdateModel;

  const repository = DI.repositoriesFactory.createRepositoryFor("User") as UserRepository;
  const result = await repository.update({ id }, request);

  res.json(result);
});

// Delete.

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;

  const repository = DI.repositoriesFactory.createRepositoryFor("User") as UserRepository;
  const result = await repository.delete({ id });

  res.json(result);
});

export const UserController = router;

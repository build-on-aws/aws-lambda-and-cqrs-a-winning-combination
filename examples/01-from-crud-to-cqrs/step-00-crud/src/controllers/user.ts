import Router from 'express-promise-router';
import KSUID from 'ksuid';
import { Request, Response } from 'express';
import { extractPaginationDetails } from "./helpers/pagination";
import { DI } from '../server';
import { User } from '../model/User';
import { UserMapping } from '../mapping/UserMapping';

const router = Router();

// Create.

router.post('/', async (req: Request, res: Response) => {
  const payload = req.body;
  const mapping = UserMapping.validateAndConstructFromPayload(payload);

  const id = await KSUID.random();
  const entity = User.fromMapping(id, mapping);

  await DI.database.users.put(entity);

  res.json(entity.toMapping());
});

// Read (All).

router.get('/', async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req, User.getPrimaryKey);

  const collection = await DI.database.users.query()
    .partitionKey('type')
    .eq(User.name)
    .limit(pagination.pageSize)
    .sort(pagination.sortOrder)
    .startAt(pagination.startAtKey)
    .run();

  res.json(collection.items.map((entity: User) => entity.toMapping()));
});

// Read (One).

router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  UserMapping.validateIdentifiers(id);

  const entity = await DI.database.users.get(User.getPrimaryKey(id));

  res.json(entity.toMapping());
});

// Update.

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const mapping = UserMapping.validateAndConstructFromPayload({ id, ...payload });

  const entity = User.fromCompleteMapping(mapping);
  const updatedEntity = await DI.database.users.update(User.getPrimaryKey(mapping.id!), entity.toUpdateStructure());

  res.json(updatedEntity.toMapping());
});

// Delete.

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  UserMapping.validateIdentifiers(id);

  await DI.database.users.delete(User.getPrimaryKey(id));

  res.json(UserMapping.emptyMapping(id));
});

export const UserController = router;

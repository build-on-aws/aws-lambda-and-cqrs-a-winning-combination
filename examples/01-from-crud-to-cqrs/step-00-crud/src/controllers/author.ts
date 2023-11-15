import Router from 'express-promise-router';
import KSUID from 'ksuid';
import moment from 'moment';
import { Request, Response } from 'express';
import { Author } from '../model/Author';
import { DI } from "../server";

const router = Router();

// Create.
router.post('/', async (req: Request, res: Response) => {
  const payload = req.body;

  // TODO: Input validation.

  const id = await KSUID.random();
  const entity = new Author({
    ...Author.getPrimaryKey(id.string),
    name: payload.name,
    birthdate: moment(payload.birthdate).toDate()
  });

  await DI.database.authors.put(entity);

  // TODO: No manual mapping!
  res.json({ id: entity.resourceId, name: entity.name, birthdate: entity.birthdate });
});

// Read (All).
router.get('/', async (req: Request, res: Response) => {
  const collection = await DI.database.authors.query()
    .partitionKey('type')
    .eq(Author.name)
    .run();

  // TODO: No manual mapping!
  res.json(collection.items.map((entity: Author) => {
    return {
      id: entity.resourceId,
      name: entity.name,
      birthdate: entity.birthdate
    }
  }));
});

// Read (One).

router.get('/:id', async (req: Request<{id: string}>, res: Response) => {
  const id = req.params.id;

  // TODO: Input validation.

  const entity = await DI.database.authors.get(Author.getPrimaryKey(id));

  // TODO: No manual mapping!
  res.json({ id: entity.resourceId, name: entity.name, birthdate: entity.birthdate });
});

// Update.

router.put('/:id', async (req: Request<{id: string}>, res: Response) => {
  const payload = req.body;
  const id = req.params.id;

  // TODO: Input validation.

  const entity = await DI.database.authors.update(Author.getPrimaryKey(id), {
    set: {
      name: payload.name,
      birthdate: payload.birthdate
    }
  });

  // TODO: No manual mapping!
  res.json({ id: entity.resourceId, name: entity.name, birthdate: entity.birthdate });
});

// Delete.

router.delete('/:id', async (req: Request<{id: string}>, res: Response) => {
  const id = req.params.id;

  // TODO: Input validation.

  await DI.database.authors.delete(Author.getPrimaryKey(id));

  // TODO: No manual mapping!
  res.json({ id });
});

export const AuthorController = router;

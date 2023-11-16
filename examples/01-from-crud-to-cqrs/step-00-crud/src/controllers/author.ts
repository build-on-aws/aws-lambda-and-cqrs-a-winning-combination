import Router from 'express-promise-router';
import KSUID from 'ksuid';
import { Request, Response } from 'express';
import { DI } from '../server';
import { Author } from '../model/Author';
import { AuthorMapping } from '../mapping/AuthorMapping';

const router = Router();

// Create.

router.post('/', async (req: Request, res: Response) => {
  const payload = req.body;
  const mapping = AuthorMapping.validateAndConstructFromPayload(payload);

  const id = await KSUID.random();
  const entity = Author.fromMapping(id, mapping);

  await DI.database.authors.put(entity);

  res.json(entity.toMapping());
});

// Read (All).

router.get('/', async (req: Request, res: Response) => {
  const collection = await DI.database.authors.query()
    .partitionKey('type')
    .eq(Author.name)
    .run();

  res.json(collection.items.map((entity: Author) => entity.toMapping()));
});

// Read (One).

router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  AuthorMapping.validateIdentifiers(id);

  const entity = await DI.database.authors.get(Author.getPrimaryKey(id));

  res.json(entity.toMapping());
});

// Update.

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const mapping = AuthorMapping.validateAndConstructFromPayload({ id, ...payload });

  const entity = Author.fromCompleteMapping(mapping);
  const updatedEntity = await DI.database.authors.update(Author.getPrimaryKey(mapping.id!), entity.toUpdateStructure());

  res.json(updatedEntity.toMapping());
});

// Delete.

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  AuthorMapping.validateIdentifiers(id);

  await DI.database.authors.delete(Author.getPrimaryKey(id));

  res.json(AuthorMapping.emptyMapping(id));
});

export const AuthorController = router;

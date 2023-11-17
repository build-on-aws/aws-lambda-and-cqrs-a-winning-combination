import Router from 'express-promise-router';
import KSUID from 'ksuid';
import { Request, Response } from 'express';
import { extractPaginationDetails } from "./helpers/pagination";
import { DI } from '../server';
import { Book } from '../model/Book';
import { BookMapping } from '../mapping/BookMapping';


const router = Router();

// Create.

router.post('/', async (req: Request, res: Response) => {
  const payload = req.body;
  const mapping = BookMapping.validateAndConstructFromPayload(payload);

  const id = await KSUID.random();
  const entity = Book.fromMapping(id, mapping);

  await DI.database.books.put(entity);

  res.json(entity.toMapping());
});

// Read (All).

router.get('/', async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req, Book.getPrimaryKey);

  const collection = await DI.database.books.query()
    .partitionKey('type')
    .eq(Book.name)
    .limit(pagination.pageSize)
    .sort(pagination.sortOrder)
    .startAt(pagination.startAtKey)
    .run();

  res.json(collection.items.map((entity: Book) => entity.toMapping()));
});

// Read (One).

router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  BookMapping.validateIdentifiers(id);

  const entity = await DI.database.books.get(Book.getPrimaryKey(id));

  res.json(entity.toMapping());
});

// Update.

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const mapping = BookMapping.validateAndConstructFromPayload({ id, ...payload });

  const entity = Book.fromCompleteMapping(mapping);
  const updatedEntity = await DI.database.books.update(Book.getPrimaryKey(mapping.id!), entity.toUpdateStructure());

  res.json(updatedEntity.toMapping());
});

// Delete.

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  BookMapping.validateIdentifiers(id);

  await DI.database.books.delete(Book.getPrimaryKey(id));

  res.json(BookMapping.emptyMapping(id));
});

export const BookController = router;

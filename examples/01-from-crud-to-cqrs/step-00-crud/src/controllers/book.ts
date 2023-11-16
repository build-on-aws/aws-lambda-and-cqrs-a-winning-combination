import Router from 'express-promise-router';
import KSUID from 'ksuid';
import { NotFoundError } from "dynamode/utils";
import { Request, Response } from 'express';
import { DI } from '../server';
import { Book } from '../model/Book';
import { BookMapping } from '../mapping/BookMapping';

const router = Router();

// Create.

router.post('/by-author/:authorId', async (req: Request<{ authorId: string }>, res: Response) => {
  const authorId = req.params.authorId;
  const payload = req.body;

  BookMapping.validateIdentifiers(authorId);
  const mapping = BookMapping.validateAndConstructFromPayload(payload);

  const bookId = await KSUID.random();
  const entity = Book.fromMapping(KSUID.parse(authorId), bookId, mapping);

  await DI.database.books.put(entity);

  res.json(entity.toMapping());
});

// Read (All).

router.get('/', async (req: Request, res: Response) => {
  // TODO: Pagination.
  const collection = await DI.database.books.query()
    .partitionKey('type')
    .eq(Book.name)
    .run();

  res.json(collection.items.map((entity: Book) => entity.toMapping()));
});

// Read (One).

router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const bookId = req.params.id;
  BookMapping.validateIdentifiers(bookId);

  const collection = await DI.database.books.query()
    .partitionKey('type')
    .eq(Book.name)
    .sortKey('subType')
    .eq(bookId)
    .limit(1)
    .run();

  if (collection.items.length === 0) {
     throw new NotFoundError(`Cannot find a book with given ID: ${bookId}`);
  }

  res.json(collection.items[0].toMapping());
});

// Update.

router.put('/by-author/:authorId/:id', async (req: Request<{ authorId: string, id: string }>, res: Response) => {
  const bookId = req.params.id;
  const authorId = req.params.authorId;
  const payload = req.body;
  const mapping = BookMapping.validateAndConstructFromPayload({ id: bookId, authorId, ...payload });

  const entity = Book.fromCompleteMapping(mapping);
  const primaryKey = Book.getPrimaryKey(mapping.authorId!, mapping.id!);
  const updatedEntity = await DI.database.books.update(primaryKey, entity.toUpdateStructure());

  res.json(updatedEntity.toMapping());
});

// Delete.

router.delete('/by-author/:authorId/:id', async (req: Request<{ authorId: string, id: string }>, res: Response) => {
  const bookId = req.params.id;
  const authorId = req.params.authorId;
  BookMapping.validateIdentifiers(authorId, bookId);

  await DI.database.books.delete(Book.getPrimaryKey(authorId, bookId));

  res.json(BookMapping.emptyMapping(bookId));
});

export const BookController = router;

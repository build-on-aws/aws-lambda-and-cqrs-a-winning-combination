import Router from 'express-promise-router';
import KSUID from 'ksuid';
import { Request, Response } from 'express';
import { extractPaginationDetails } from "./helpers/pagination";
import { DI } from '../server';
import { Rental } from '../model/Rental';
import { RentalMapping } from '../mapping/RentalMapping';

const router = Router();

// Create.

router.post('/:userId/:bookId', async (req: Request, res: Response) => {
  const id = req.params.id;
  const bookId = req.params.bookId;
  const payload = req.body;

  RentalMapping.validateIdentifiers(id, bookId);
  const mapping = RentalMapping.validateAndConstructFromPayload(payload);

  const entity = Rental.fromMapping(KSUID.parse(id), KSUID.parse(bookId), mapping);

  await DI.database.rentals.put(entity);

  res.json(entity.toMapping());
});

// Read (All).

router.get('/', async (req: Request, res: Response) => {
  const pagination = extractPaginationDetails(req, Rental.getPrimaryKey);

  const collection = await DI.database.rentals.query()
    .partitionKey('type')
    .eq(Rental.name)
    .limit(pagination.pageSize)
    .sort(pagination.sortOrder)
    .startAt(pagination.startAtKey)
    .run();

  res.json(collection.items.map((entity: Rental) => entity.toMapping()));
});

// Read (All Rentals for User).

router.get('/:userId', async (req: Request<{ userId: string }>, res: Response) => {
  const userId = req.params.userId;

  const pagination = extractPaginationDetails(req, Rental.getPrimaryKey);

  const collection = await DI.database.rentals.query()
    .partitionKey('status')
    .eq(Rental.name)
    .sortKey('subStatus')
    .eq(userId)
    .limit(pagination.pageSize)
    .sort(pagination.sortOrder)
    .startAt(pagination.startAtKey)
    .run();

  res.json(collection.items.map((entity: Rental) => entity.toMapping()));
});


// Read (One).

router.get('/:userId/:bookId', async (req: Request<{ userId: string, bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  RentalMapping.validateIdentifiers(userId, bookId);

  const entity = await DI.database.rentals.get(Rental.getPrimaryKey(userId, bookId));

  res.json(entity.toMapping());
});

// Update.

router.put('/:userId/:bookId', async (req: Request<{ userId: string, bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const payload = req.body;
  const mapping = RentalMapping.validateAndConstructFromPayload({ userId, bookId, ...payload });

  const entity = Rental.fromCompleteMapping(mapping);
  const primaryKey = Rental.getPrimaryKey(mapping.userId!, mapping.bookId!);
  const updatedEntity = await DI.database.rentals.update(primaryKey, entity.toUpdateStructure());

  res.json(updatedEntity.toMapping());
});

// Delete.

router.delete('/:userId/:bookId', async (req: Request<{ userId: string, bookId: string }>, res: Response) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  RentalMapping.validateIdentifiers(userId, bookId);

  await DI.database.rentals.delete(Rental.getPrimaryKey(userId, bookId));

  res.json(RentalMapping.emptyMapping(userId, bookId));
});

export const RentalController = router;

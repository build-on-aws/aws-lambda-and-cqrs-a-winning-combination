import Router from 'express-promise-router';
import KSUID from 'ksuid';
import { Request, Response } from 'express';
import { DI } from '../server';
import { Rental } from '../model/Rental';
import { RentalMapping } from '../mapping/RentalMapping';

const router = Router();

// Create.

router.post('/for-user/:id/:bookId', async (req: Request<{ id: string, bookId: string }>, res: Response) => {
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
  const collection = await DI.database.rentals.query()
    .partitionKey('type')
    .eq(Rental.name)
    .run();

  res.json(collection.items.map((entity: Rental) => entity.toMapping()));
});

// Read (One).

router.get('/for-user/:id/:bookId', async (req: Request<{ id: string, bookId: string }>, res: Response) => {
  const id = req.params.id;
  const bookId = req.params.bookId;
  RentalMapping.validateIdentifiers(id, bookId);

  const entity = await DI.database.rentals.get(Rental.getPrimaryKey(id, bookId));

  res.json(entity.toMapping());
});

// Update.

router.put('/for-user/:id/:bookId', async (req: Request<{ id: string, bookId: string }>, res: Response) => {
  const userId = req.params.id;
  const bookId = req.params.bookId;
  const payload = req.body;
  const mapping = RentalMapping.validateAndConstructFromPayload({ userId, bookId, ...payload });

  const entity = Rental.fromCompleteMapping(mapping);
  const primaryKey = Rental.getPrimaryKey(mapping.userId!, mapping.bookId!);
  const updatedEntity = await DI.database.rentals.update(primaryKey, entity.toUpdateStructure());

  res.json(updatedEntity.toMapping());
});

// Delete.

router.delete('/for-user/:id/:bookId', async (req: Request<{ id: string, bookId: string }>, res: Response) => {
  const id = req.params.id;
  const bookId = req.params.bookId;
  RentalMapping.validateIdentifiers(id, bookId);

  await DI.database.rentals.delete(Rental.getPrimaryKey(id, bookId));

  res.json(RentalMapping.emptyMapping(id, bookId));
});

export const RentalController = router;

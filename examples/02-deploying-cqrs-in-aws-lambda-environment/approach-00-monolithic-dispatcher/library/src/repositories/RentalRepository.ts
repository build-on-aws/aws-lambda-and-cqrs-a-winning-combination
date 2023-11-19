/* eslint @typescript-eslint/no-unused-vars: 0 */
import { IRepository } from "./IRepository";
import { Rental, RentalKey, RentalStatus, RentalUpdateModel } from "../models/Rental";

export class RentalRepository implements IRepository<Rental, RentalUpdateModel, RentalKey> {
  create(model: Rental): Rental {
    return {
      bookId: model.bookId,
      userId: model.userId,
      status: model.status,
      comment: model.comment,
    };
  }

  read(primaryKey: RentalKey): Rental {
    return {
      bookId: primaryKey.bookId,
      userId: primaryKey.userId,
      status: RentalStatus.BORROWED,
      comment: "",
    };
  }

  update(primaryKey: Rental, model: RentalUpdateModel): Rental {
    return {
      bookId: primaryKey.bookId,
      userId: primaryKey.userId,
      status: model.status ?? RentalStatus.BORROWED,
      comment: model.comment ?? "",
    };
  }

  delete(primaryKey: RentalKey): RentalKey {
    return {
      bookId: primaryKey.bookId,
      userId: primaryKey.userId,
    };
  }

  queryByTypeAndSortKey(entityName: string, sortKey: string): Rental[] {
    return [];
  }

  queryByTypeAndStatus(entityName: string, status: string): Rental[] {
    return [];
  }
}

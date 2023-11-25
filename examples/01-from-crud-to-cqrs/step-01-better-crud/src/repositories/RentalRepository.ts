import { IDatabaseProvider, PaginationParameters, Pair } from "../database/IDatabaseProvider";
import { BaseRepository } from "./BaseRepository";
import { Rental, RentalPrimaryKey, RentalUpdateModel } from "../models/Rental";
import { ByTypeAndSortKey, ByTypeAndStatus, Index } from "../database/DatabaseProvider";
import { PrimaryKey } from "../database/DatabaseEntities";

export class RentalRepository extends BaseRepository<Rental, RentalUpdateModel, RentalPrimaryKey> {
  constructor(databaseProvider: IDatabaseProvider) {
    super(databaseProvider);
  }

  async create(model: Rental): Promise<Rental> {
    await this.databaseProvider.put({
      ...this.getFormattedKey({ bookId: model.bookId, userId: model.userId }),
      type: "Rental",
      ...model,
    });

    return {
      bookId: model.bookId,
      userId: model.userId,
      status: model.status,
      comment: model.comment,
    };
  }

  async read(primaryKey: RentalPrimaryKey): Promise<Rental> {
    const result = await this.databaseProvider.get(this.getFormattedKey(primaryKey));

    return {
      bookId: primaryKey.bookId,
      userId: primaryKey.userId,
      status: result["status"],
      comment: result["comment"],
    };
  }

  async update(primaryKey: RentalPrimaryKey, model: RentalUpdateModel): Promise<Rental> {
    const fields: Pair[] = [];

    if (model.status) {
      fields.push({ name: "status", value: model.status });
    }

    if (model.comment) {
      fields.push({ name: "comment", value: model.comment });
    }

    const result = await this.databaseProvider.update(this.getFormattedKey(primaryKey), fields);

    return {
      bookId: primaryKey.bookId,
      userId: primaryKey.userId,
      status: result["status"],
      comment: result["comment"],
    };
  }

  async delete(primaryKey: RentalPrimaryKey): Promise<RentalPrimaryKey> {
    await this.databaseProvider.delete(this.getFormattedKey(primaryKey));

    return {
      bookId: primaryKey.bookId,
      userId: primaryKey.userId,
    };
  }

  async queryByTypeAndSortKey(name: string, sortKey: string, pagination?: PaginationParameters): Promise<Rental[]> {
    const collection = await this.databaseProvider.query(ByTypeAndSortKey(name, sortKey), Index.TYPE, pagination);

    return collection.map((record) => {
      return {
        bookId: record["resourceId"].split("#")[1],
        userId: record["subResourceId"].split("#")[1],
        status: record["status"],
        comment: record["comment"],
      };
    });
  }

  async queryByTypeAndStatus(name: string, status: string, pagination?: PaginationParameters): Promise<Rental[]> {
    const collection = await this.databaseProvider.query(ByTypeAndStatus(name, status), Index.STATUS, pagination);

    return collection.map((record) => {
      return {
        bookId: record["resourceId"].split("#")[1],
        userId: record["subResourceId"].split("#")[1],
        status: record["status"],
        comment: record["comment"],
      };
    });
  }

  protected getFormattedKey(primaryKey: RentalPrimaryKey): PrimaryKey {
    return {
      resourceId: `Book#${primaryKey.bookId}`,
      subResourceId: `User#${primaryKey.userId}`,
    };
  }
}

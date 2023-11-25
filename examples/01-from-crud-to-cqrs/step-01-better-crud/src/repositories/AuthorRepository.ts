import KSUID from "ksuid";
import moment from "moment";
import { IDatabaseProvider, PaginationParameters, Pair } from "../database/IDatabaseProvider";
import { BaseRepository } from "./BaseRepository";
import { Author, AuthorPrimaryKey, AuthorUpdateModel } from "../models/Author";
import { PrimaryKey } from "../database/DatabaseEntities";
import { ByTypeAndSortKey, ByTypeAndStatus, Index } from "../database/DatabaseProvider";
import { MappingValidationError } from "../exceptions/MappingValidationError";

export class AuthorRepository extends BaseRepository<Author, AuthorUpdateModel, AuthorPrimaryKey> {
  constructor(databaseProvider: IDatabaseProvider) {
    super(databaseProvider);
  }

  async create(model: Author): Promise<Author> {
    const id = KSUID.randomSync().string;

    if (!model.name) {
      throw new MappingValidationError("Author: 'name' field is required");
    }

    if (!model.birthdate) {
      throw new MappingValidationError("Author: 'birthdate' field is required");
    }

    await this.databaseProvider.put({
      ...this.getFormattedKey({ id }),
      type: "Author",
      ...model,
    });

    return {
      id,
      name: model.name,
      birthdate: model.birthdate,
    };
  }

  async read(primaryKey: AuthorPrimaryKey): Promise<Author> {
    const result = await this.databaseProvider.get(this.getFormattedKey(primaryKey));

    return {
      id: primaryKey.id,
      name: result["name"],
      birthdate: result["birthdate"],
    };
  }

  async update(primaryKey: AuthorPrimaryKey, model: AuthorUpdateModel): Promise<Author> {
    const fields: Pair[] = [];

    if (model.name) {
      fields.push({ name: "name", value: model.name });
    }

    if (model.birthdate) {
      fields.push({ name: "birthdate", value: moment(model.birthdate).toISOString() });
    }

    const result = await this.databaseProvider.update(this.getFormattedKey(primaryKey), fields);

    return {
      id: primaryKey.id,
      name: result["name"],
      birthdate: result["birthdate"],
    };
  }

  async delete(primaryKey: AuthorPrimaryKey): Promise<AuthorPrimaryKey> {
    await this.databaseProvider.delete(this.getFormattedKey(primaryKey));

    return {
      id: primaryKey.id,
    };
  }

  async queryByTypeAndSortKey(name: string, sortKey: string, pagination?: PaginationParameters): Promise<Author[]> {
    const collection = await this.databaseProvider.query(ByTypeAndSortKey(name, sortKey), Index.TYPE, pagination);

    return collection.map((record) => {
      return {
        id: record["resourceId"].split("#")[1],
        name: record["name"],
        birthdate: record["birthdate"],
      };
    });
  }

  async queryByTypeAndStatus(name: string, status: string, pagination?: PaginationParameters): Promise<Author[]> {
    const collection = await this.databaseProvider.query(ByTypeAndStatus(name, status), Index.STATUS, pagination);

    return collection.map((record) => {
      return {
        id: record["resourceId"].split("#")[1],
        name: record["name"],
        birthdate: record["birthdate"],
      };
    });
  }

  protected getFormattedKey(primaryKey: AuthorPrimaryKey): PrimaryKey {
    return {
      resourceId: `Author#${primaryKey.id}`,
      subResourceId: `Author#${primaryKey.id}`,
    };
  }
}

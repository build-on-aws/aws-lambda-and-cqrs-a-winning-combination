import KSUID from "ksuid";
import { IDatabaseProvider, PaginationParameters, Pair } from "../database/IDatabaseProvider";
import { BaseRepository } from "./BaseRepository";
import { User, UserPrimaryKey, UserUpdateModel } from "../models/User";
import { ByTypeAndSortKey, ByTypeAndStatus, Index } from "../database/DatabaseProvider";
import { PrimaryKey } from "../database/DatabaseEntities";
import { MappingValidationError } from "../exceptions/MappingValidationError";

export class UserRepository extends BaseRepository<User, UserUpdateModel, UserPrimaryKey> {
  constructor(databaseProvider: IDatabaseProvider) {
    super(databaseProvider);
  }

  async create(model: User): Promise<User> {
    const id = KSUID.randomSync().string;

    if (!model.name) {
      throw new MappingValidationError("User: 'name' field is required");
    }

    if (!model.email) {
      throw new MappingValidationError("Book: 'email' field is required");
    }

    await this.databaseProvider.put({
      ...this.getFormattedKey({ id }),
      type: "User",
      ...model,
    });

    return {
      id: id,
      name: model.name,
      email: model.email,
      status: model.status,
      comment: model.comment,
    };
  }

  async read(primaryKey: UserPrimaryKey): Promise<User> {
    const result = await this.databaseProvider.get(this.getFormattedKey(primaryKey));

    return {
      id: primaryKey.id,
      name: result["name"],
      email: result["email"],
      status: result["status"],
      comment: result["comment"],
    };
  }

  async update(primaryKey: UserPrimaryKey, model: UserUpdateModel): Promise<User> {
    const fields: Pair[] = [];

    if (model.name) {
      fields.push({ name: "name", value: model.name });
    }

    if (model.email) {
      fields.push({ name: "email", value: model.email });
    }

    if (model.status) {
      fields.push({ name: "status", value: model.status });
    }

    if (model.comment) {
      fields.push({ name: "comment", value: model.comment });
    }

    const result = await this.databaseProvider.update(this.getFormattedKey(primaryKey), fields);

    return {
      id: primaryKey.id,
      name: result["name"],
      email: result["email"],
      status: result["status"],
      comment: result["comment"],
    };
  }

  async delete(primaryKey: UserPrimaryKey): Promise<UserPrimaryKey> {
    await this.databaseProvider.delete(this.getFormattedKey(primaryKey));

    return {
      id: primaryKey.id,
    };
  }

  async queryByTypeAndSortKey(name: string, sortKey: string, pagination?: PaginationParameters): Promise<User[]> {
    const collection = await this.databaseProvider.query(ByTypeAndSortKey(name, sortKey), Index.TYPE, pagination);

    return collection.map((record) => {
      return {
        id: record["resourceId"].split("#")[1],
        name: record["name"],
        email: record["email"],
        status: record["status"],
        comment: record["comment"],
      };
    });
  }

  async queryByTypeAndStatus(name: string, status: string, pagination?: PaginationParameters): Promise<User[]> {
    const collection = await this.databaseProvider.query(ByTypeAndStatus(name, status), Index.STATUS, pagination);

    return collection.map((record) => {
      return {
        id: record["resourceId"].split("#")[1],
        name: record["name"],
        email: record["email"],
        status: record["status"],
        comment: record["comment"],
      };
    });
  }

  protected getFormattedKey(primaryKey: UserPrimaryKey): PrimaryKey {
    return {
      resourceId: `User#${primaryKey.id}`,
      subResourceId: `User#${primaryKey.id}`,
    };
  }
}

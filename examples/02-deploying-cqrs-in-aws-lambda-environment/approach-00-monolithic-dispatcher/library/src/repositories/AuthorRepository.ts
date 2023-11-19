/* eslint @typescript-eslint/no-unused-vars: 0 */
import KSUID from "ksuid";
import { IRepository } from "./IRepository";
import { Author, AuthorKey, AuthorUpdateModel } from "../models/Author";

export class AuthorRepository implements IRepository<Author, AuthorUpdateModel, AuthorKey> {
  create(model: Author): Author {
    const ksuid = KSUID.randomSync().string;

    return {
      id: ksuid,
      name: model.name,
      birthdate: model.birthdate,
    };
  }

  read(primaryKey: AuthorKey): Author {
    return {
      id: primaryKey.id,
      name: "",
      birthdate: "",
    };
  }

  update(primaryKey: AuthorKey, model: AuthorUpdateModel): Author {
    return {
      id: primaryKey.id,
      name: model.name ?? "",
      birthdate: model.birthdate ?? "",
    };
  }

  delete(primaryKey: AuthorKey): AuthorKey {
    return {
      id: primaryKey.id,
    };
  }

  queryByTypeAndSortKey(entityName: string, sortKey: string): Author[] {
    return [];
  }

  queryByTypeAndStatus(entityName: string, status: string): Author[] {
    return [];
  }
}

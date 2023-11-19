/* eslint @typescript-eslint/no-unused-vars: 0 */
import KSUID from "ksuid";
import { IRepository } from "./IRepository";
import { User, UserKey, UserStatus, UserUpdateModel } from "../models/User";

export class UserRepository implements IRepository<User, UserUpdateModel, UserKey> {
  create(model: User): User {
    const ksuid = KSUID.randomSync().string;

    return {
      id: ksuid,
      name: model.name,
      email: model.email,
      status: model.status,
      comment: model.comment,
    };
  }

  read(primaryKey: UserKey): User {
    return {
      id: primaryKey.id,
      name: "",
      email: "",
      status: UserStatus.NOT_VERIFIED,
      comment: "",
    };
  }

  update(primaryKey: UserKey, model: UserUpdateModel): User {
    return {
      id: primaryKey.id,
      name: model.name ?? "",
      email: model.email ?? "",
      status: model.status ?? UserStatus.NOT_VERIFIED,
      comment: model.comment ?? "",
    };
  }

  delete(primaryKey: UserKey): UserKey {
    return {
      id: primaryKey.id,
    };
  }

  queryByTypeAndSortKey(entityName: string, sortKey: string): User[] {
    return [];
  }

  queryByTypeAndStatus(entityName: string, status: string): User[] {
    return [];
  }
}

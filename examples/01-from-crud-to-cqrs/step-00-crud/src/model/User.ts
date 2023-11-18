import KSUID from "ksuid";
import moment from "moment";
import { MappingValidationError } from "../exceptions/MappingValidationError";
import { BaseModel, EmptyMapping, IMapper, PrimaryKey } from "../common/model";
import { FieldsToUpdate } from "../database/DatabaseActionsProvider";

type UserPayload = {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
};

export enum UserStatus {
  NOT_VERIFIED = "NOT_VERIFIED",
  VERIFIED = "VERIFIED",
  SUSPENDED = "SUSPENDED",
}

export type UserModel = BaseModel & {
  name?: string;
  email?: string;
  status?: string;
  comment?: string;
};

export class User implements IMapper<UserPayload, UserModel> {
  private readonly id: KSUID;
  private readonly name?: string;
  private readonly email?: string;
  private readonly status?: UserStatus;
  private readonly comment?: string;

  protected constructor(payload: UserPayload) {
    this.id = payload.id ? KSUID.parse(payload.id) : KSUID.randomSync();
    this.name = payload.name ?? undefined;
    this.email = payload.email ?? undefined;
    this.status = payload.status ? UserStatus[payload.status as keyof typeof UserStatus] : undefined;
    this.comment = payload.comment ?? undefined;
  }

  static fromPayloadForCreate(payload: UserPayload) {
    if (!payload.name) {
      throw new MappingValidationError("Field `name` is required and should be a non-empty string");
    }

    if (!payload.email) {
      throw new MappingValidationError("Field `email` is required and should be a non-empty string");
    }

    payload.status = UserStatus.NOT_VERIFIED;
    payload.comment = "";

    return new User(payload);
  }

  static fromPayloadForUpdate(id: string, payload: UserPayload) {
    try {
      KSUID.parse(id);
    } catch (error: any) {
      throw new MappingValidationError("The provided ID must be a valid KSUID");
    }

    if (payload.name && payload.name === "") {
      throw new MappingValidationError("Field `name` should be a non-empty string");
    }

    if (payload.email && payload.email === "") {
      throw new MappingValidationError("Field `email` should be a non-empty string");
    }

    if (payload.status && payload.status === "") {
      throw new MappingValidationError("Field `status` should be a non-empty string");
    }

    return new User({
      id,
      ...payload,
    });
  }

  static fromId(id: string) {
    try {
      KSUID.parse(id);
    } catch (error: any) {
      throw new MappingValidationError("The provided ID must be a valid KSUID");
    }

    return new User({ id });
  }

  static fromModel(model: UserModel) {
    const id = model.resourceId.split("#")[1];

    try {
      KSUID.parse(id);
    } catch (error: any) {
      throw new MappingValidationError("The provided ID must be a valid KSUID");
    }

    return new User({
      id,
      name: model.name,
      email: model.email,
      status: model.status,
      comment: model.comment,
    });
  }

  emptyMapping(): EmptyMapping {
    return {
      id: this.id.string,
    };
  }

  toKey(): PrimaryKey {
    return {
      resourceId: `User#${this.id.string}`,
      subResourceId: `User#${this.id.string}`,
    };
  }

  toModel() {
    return {
      ...this.toKey(),
      type: User.name,
      name: this.name,
      email: this.email,
      status: this.status,
      comment: this.comment,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    };
  }

  toMapping(): UserPayload {
    return {
      id: this.id.string,
      name: this.name,
      email: this.email,
      status: this.status,
      comment: this.comment,
    };
  }

  toUpdate(): FieldsToUpdate {
    const fields = [];

    if (this.name) {
      fields.push({ name: "name", value: this.name });
    }

    if (this.email) {
      fields.push({ name: "email", value: this.email });
    }

    if (this.status) {
      fields.push({ name: "status", value: this.status });
    }

    if (this.comment) {
      fields.push({ name: "comment", value: this.comment });
    }

    return fields;
  }
}

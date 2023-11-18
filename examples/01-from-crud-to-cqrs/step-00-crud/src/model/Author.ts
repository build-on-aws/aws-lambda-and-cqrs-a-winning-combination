import KSUID from "ksuid";
import moment from "moment";
import { MappingValidationError } from "../exceptions/MappingValidationError";
import { BaseModel, EmptyMapping, IMapper, PrimaryKey } from "./base";
import { FieldsToUpdate } from "../database/DatabaseActionsProvider";

type AuthorPayload = {
  id?: string;
  name?: string;
  birthdate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthorModel = BaseModel & {
  name?: string;
  birthdate?: string;
};

export class Author implements IMapper<AuthorPayload, AuthorModel> {
  private readonly id: KSUID;
  private readonly name?: string;
  private readonly birthdate?: Date;

  protected constructor(payload: AuthorPayload) {
    this.id = payload.id ? KSUID.parse(payload.id) : KSUID.randomSync();
    this.name = payload.name ?? undefined;
    this.birthdate = payload.birthdate ? moment(payload.birthdate).toDate() : undefined;
  }

  static fromPayloadForCreate(payload: AuthorPayload) {
    if (!payload.name) {
      throw new MappingValidationError("Field `name` is required and should be a non-empty string");
    }

    if (!payload.birthdate) {
      throw new MappingValidationError("Field `birthdate` is required");
    }

    if (!moment(payload.birthdate).isValid()) {
      throw new MappingValidationError("Field `birthdate` must convert to date and time");
    }

    return new Author(payload);
  }

  static fromPayloadForUpdate(id: string, payload: AuthorPayload) {
    try {
      KSUID.parse(id);
    } catch (error: any) {
      throw new MappingValidationError("The provided ID must be a valid KSUID");
    }

    if (payload.name && payload.name === "") {
      throw new MappingValidationError("Field `name` should be a non-empty string");
    }

    if (payload.birthdate && !moment(payload.birthdate).isValid()) {
      throw new MappingValidationError("Field `birthdate` must convert to date and time");
    }

    return new Author({
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

    return new Author({ id });
  }

  static fromModel(model: AuthorModel) {
    const id = model.resourceId.split("#")[1];

    try {
      KSUID.parse(id);
    } catch (error: any) {
      throw new MappingValidationError("The provided ID must be a valid KSUID");
    }

    return new Author({
      id,
      name: model.name,
      birthdate: model.birthdate,
    });
  }

  emptyMapping(): EmptyMapping {
    return {
      id: this.id.string,
    };
  }

  toKey(): PrimaryKey {
    return {
      resourceId: `Author#${this.id.string}`,
      subResourceId: `Author#${this.id.string}`,
    };
  }

  toModel() {
    return {
      ...this.toKey(),
      type: Author.name,
      name: this.name,
      birthdate: this.birthdate ? moment(this.birthdate).toISOString() : undefined,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    };
  }

  toMapping(): AuthorPayload {
    return {
      id: this.id.string,
      name: this.name,
      birthdate: moment(this.birthdate).toISOString(),
    };
  }

  toUpdate(): FieldsToUpdate {
    const fields = [];

    if (this.name) {
      fields.push({ name: "name", value: this.name });
    }

    if (this.birthdate) {
      fields.push({ name: "birthdate", value: moment(this.birthdate).toISOString() });
    }

    return fields;
  }
}

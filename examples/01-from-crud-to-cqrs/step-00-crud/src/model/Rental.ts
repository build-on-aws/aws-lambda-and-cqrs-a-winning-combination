import KSUID from "ksuid";
import moment from "moment";
import { MappingValidationError } from "../exceptions/MappingValidationError";
import { BaseModel, IMapper, PrimaryKey } from "./base";
import { FieldsToUpdate } from "../database/DatabaseActionsProvider";

type RentalPayload = {
  bookId?: string;
  userId?: string;
  status?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
};

export enum RentalStatus {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
}

export type RentalModel = BaseModel & {
  status?: string;
  comment?: string;
};

type EmptyRentalMapping = {
  userId: string;
  bookId: string;
};

export class Rental implements IMapper<RentalPayload, RentalModel, EmptyRentalMapping> {
  private readonly bookId: KSUID;
  private readonly userId: KSUID;
  private readonly status?: RentalStatus;
  private readonly comment?: string;

  protected constructor(payload: RentalPayload) {
    this.bookId = payload.bookId ? KSUID.parse(payload.bookId) : KSUID.randomSync();
    this.userId = payload.userId ? KSUID.parse(payload.userId) : KSUID.randomSync();
    this.status = payload.status ? RentalStatus[payload.status as keyof typeof RentalStatus] : undefined;
    this.comment = payload.comment ?? undefined;
  }

  static fromPayloadForCreate(bookId: string, userId: string, payload: RentalPayload) {
    try {
      KSUID.parse(bookId);
    } catch (error: any) {
      throw new MappingValidationError("The provided book ID must be a valid KSUID");
    }

    try {
      KSUID.parse(userId);
    } catch (error: any) {
      throw new MappingValidationError("The provided user ID must be a valid KSUID");
    }

    if (payload.status && payload.status === "") {
      throw new MappingValidationError("Field `status` should be a non-empty string");
    }

    payload.status = RentalStatus.BORROWED;
    payload.comment = "";

    return new Rental({
      userId,
      bookId,
      ...payload,
    });
  }

  static fromPayloadForUpdate(bookId: string, userId: string, payload: RentalPayload) {
    try {
      KSUID.parse(bookId);
    } catch (error: any) {
      throw new MappingValidationError("The provided book ID must be a valid KSUID");
    }

    try {
      KSUID.parse(userId);
    } catch (error: any) {
      throw new MappingValidationError("The provided user ID must be a valid KSUID");
    }

    if (payload.status && payload.status === "") {
      throw new MappingValidationError("Field `status` should be a non-empty string");
    }

    return new Rental({
      userId,
      bookId,
      ...payload,
    });
  }

  static fromId(bookId: string, userId: string) {
    try {
      KSUID.parse(bookId);
    } catch (error: any) {
      throw new MappingValidationError("The provided book ID must be a valid KSUID");
    }

    try {
      KSUID.parse(userId);
    } catch (error: any) {
      throw new MappingValidationError("The provided user ID must be a valid KSUID");
    }

    return new Rental({ bookId, userId });
  }

  static fromModel(model: RentalModel) {
    const bookId = model.resourceId.split("#")[1];
    const userId = model.subResourceId.split("#")[1];

    try {
      KSUID.parse(bookId);
    } catch (error: any) {
      throw new MappingValidationError("The provided book ID must be a valid KSUID");
    }

    try {
      KSUID.parse(userId);
    } catch (error: any) {
      throw new MappingValidationError("The provided user ID must be a valid KSUID");
    }

    return new Rental({
      bookId,
      userId,
      status: model.status,
      comment: model.comment,
    });
  }

  emptyMapping(): EmptyRentalMapping {
    return {
      userId: this.userId.string,
      bookId: this.bookId.string,
    };
  }

  toKey(): PrimaryKey {
    return {
      resourceId: `Book#${this.bookId.string}`,
      subResourceId: `User#${this.userId.string}`,
    };
  }

  toModel() {
    return {
      ...this.toKey(),
      type: Rental.name,
      status: this.status,
      comment: this.comment,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    };
  }

  toMapping(): RentalPayload {
    return {
      bookId: this.bookId.string,
      userId: this.userId.string,
      status: this.status,
      comment: this.comment,
    };
  }

  toUpdate(): FieldsToUpdate {
    const fields = [];

    if (this.status) {
      fields.push({ name: "status", value: this.status });
    }

    if (this.comment) {
      fields.push({ name: "comment", value: this.comment });
    }

    return fields;
  }
}

import KSUID from "ksuid";
import moment from "moment";
import { MappingValidationError } from "../exceptions/MappingValidationError";
import { BaseModel, IMapper, PrimaryKey } from "./base";
import { FieldsToUpdate } from "../database/DatabaseActionsProvider";

type BookPayload = {
  bookId?: string;
  authorId?: string;
  title: string;
  isbn: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export enum BookStatus {
  AVAILABLE = "AVAILABLE",
  NOT_AVAILABLE = "NOT_AVAILABLE",
  MISSING = "MISSING",
}

export type BookModel = BaseModel & {
  title: string;
  isbn: string;
  status: string;
};

type EmptyBookMapping = {
  bookId: string;
  authorId: string;
};

export class Book implements IMapper<BookPayload, BookModel, EmptyBookMapping> {
  private readonly bookId: KSUID;
  private readonly authorId: KSUID;
  private readonly title: string;
  private readonly isbn: string;
  private readonly status: BookStatus;

  protected constructor(payload: BookPayload) {
    this.bookId = payload.bookId ? KSUID.parse(payload.bookId) : KSUID.randomSync();
    this.authorId = payload.authorId ? KSUID.parse(payload.authorId) : KSUID.randomSync();
    this.title = payload.title;
    this.isbn = payload.isbn;
    this.status = BookStatus[(payload.status ?? BookStatus.NOT_AVAILABLE) as keyof typeof BookStatus];
  }

  static fromPayload(authorId: string, payload: BookPayload) {
    try {
      KSUID.parse(authorId);
    } catch (error: any) {
      throw new MappingValidationError("The provided author ID must be a valid KSUID");
    }

    if (!payload.title) {
      throw new MappingValidationError("Field `title` is required and should be a non-empty string");
    }

    if (!payload.isbn) {
      throw new MappingValidationError("Field `isbn` is required and should be a non-empty string");
    }

    return new Book({
      authorId,
      ...payload,
    });
  }

  static fromPayloadForUpdate(bookId: string, authorId: string, payload: BookPayload) {
    try {
      KSUID.parse(bookId);
    } catch (error: any) {
      throw new MappingValidationError("The provided book ID must be a valid KSUID");
    }

    try {
      KSUID.parse(authorId);
    } catch (error: any) {
      throw new MappingValidationError("The provided author ID must be a valid KSUID");
    }

    if (payload.title && payload.title === "") {
      throw new MappingValidationError("Field `title` should be a non-empty string");
    }

    if (payload.isbn && payload.isbn === "") {
      throw new MappingValidationError("Field `isbn` should be a non-empty string");
    }

    return new Book({
      bookId,
      authorId,
      ...payload,
    });
  }

  static fromId(bookId: string, authorId: string) {
    try {
      KSUID.parse(bookId);
    } catch (error: any) {
      throw new MappingValidationError("The provided book ID must be a valid KSUID");
    }

    try {
      KSUID.parse(authorId);
    } catch (error: any) {
      throw new MappingValidationError("The provided ID must be a valid KSUID");
    }

    return new Book({
      bookId,
      authorId,
      title: "",
      isbn: "",
      status: BookStatus.NOT_AVAILABLE,
    });
  }

  static fromModel(model: BookModel) {
    const bookId = model.resourceId.split("#")[1];
    const authorId = model.subResourceId.split("#")[1];

    try {
      KSUID.parse(bookId);
    } catch (error: any) {
      throw new MappingValidationError("The provided book ID must be a valid KSUID");
    }

    try {
      KSUID.parse(authorId);
    } catch (error: any) {
      throw new MappingValidationError("The provided author ID must be a valid KSUID");
    }

    return new Book({
      bookId,
      authorId,
      title: model.title,
      isbn: model.isbn,
      status: model.status,
    });
  }

  emptyMapping(): EmptyBookMapping {
    return {
      bookId: this.bookId.string,
      authorId: this.authorId.string,
    };
  }

  toKey(): PrimaryKey {
    return {
      resourceId: `User#${this.bookId.string}`,
      subResourceId: `Author#${this.authorId.string}`,
    };
  }

  toModel() {
    return {
      ...this.toKey(),
      type: Book.name,
      title: this.title,
      isbn: this.isbn,
      status: this.status,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    };
  }

  toMapping(): BookPayload {
    return {
      bookId: this.bookId.string,
      authorId: this.authorId.string,
      title: this.title,
      isbn: this.isbn,
      status: this.status,
    };
  }

  toUpdate(): FieldsToUpdate {
    const fields = [];

    if (this.title) {
      fields.push({ name: "title", value: this.title });
    }

    if (this.isbn) {
      fields.push({ name: "isbn", value: this.isbn });
    }

    if (this.status) {
      fields.push({ name: "status", value: this.status });
    }

    return fields;
  }
}

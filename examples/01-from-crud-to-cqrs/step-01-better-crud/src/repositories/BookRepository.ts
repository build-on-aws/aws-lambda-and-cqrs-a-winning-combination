import KSUID from "ksuid";
import { IDatabaseProvider, PaginationParameters, Pair } from "../database/IDatabaseProvider";
import { BaseRepository } from "./BaseRepository";
import { Book, BookPrimaryKey, BookUpdateModel } from "../models/Book";
import { ByTypeAndSortKey, ByTypeAndStatus, Index } from "../database/DatabaseProvider";
import { PrimaryKey } from "../database/DatabaseEntities";
import { MappingValidationError } from "../exceptions/MappingValidationError";

export class BookRepository extends BaseRepository<Book, BookUpdateModel, BookPrimaryKey> {
  constructor(databaseProvider: IDatabaseProvider) {
    super(databaseProvider);
  }

  async create(model: Book): Promise<Book> {
    const id = KSUID.randomSync().string;

    if (!model.title) {
      throw new MappingValidationError("Book: 'title' field is required");
    }

    if (!model.isbn) {
      throw new MappingValidationError("Book: 'isbn' field is required");
    }

    await this.databaseProvider.put({
      ...this.getFormattedKey({ bookId: id, authorId: model.authorId }),
      type: "Book",
      ...model,
    });

    return {
      bookId: id,
      authorId: model.authorId,
      status: model.status,
      title: model.title,
      isbn: model.isbn,
    };
  }

  async read(primaryKey: BookPrimaryKey): Promise<Book> {
    const result = await this.databaseProvider.get(this.getFormattedKey(primaryKey));

    return {
      bookId: primaryKey.bookId,
      authorId: primaryKey.authorId,
      status: result["status"],
      title: result["title"],
      isbn: result["isbn"],
    };
  }

  async update(primaryKey: BookPrimaryKey, model: BookUpdateModel): Promise<Book> {
    const fields: Pair[] = [];

    if (model.status) {
      fields.push({ name: "status", value: model.status });
    }

    if (model.title) {
      fields.push({ name: "title", value: model.title });
    }

    if (model.isbn) {
      fields.push({ name: "isbn", value: model.isbn });
    }

    const result = await this.databaseProvider.update(this.getFormattedKey(primaryKey), fields);

    return {
      bookId: primaryKey.bookId,
      authorId: primaryKey.authorId,
      status: result["status"],
      title: result["title"],
      isbn: result["isbn"],
    };
  }

  async delete(primaryKey: BookPrimaryKey): Promise<BookPrimaryKey> {
    await this.databaseProvider.delete(this.getFormattedKey(primaryKey));

    return {
      bookId: primaryKey.bookId,
      authorId: primaryKey.authorId,
    };
  }

  async queryByTypeAndSortKey(name: string, sortKey: string, pagination?: PaginationParameters): Promise<Book[]> {
    const collection = await this.databaseProvider.query(ByTypeAndSortKey(name, sortKey), Index.TYPE, pagination);

    return collection.map((record) => {
      return {
        bookId: record["resourceId"].split("#")[1],
        authorId: record["subResourceId"].split("#")[1],
        status: record["status"],
        title: record["title"],
        isbn: record["isbn"],
      };
    });
  }

  async queryByTypeAndStatus(name: string, status: string, pagination?: PaginationParameters): Promise<Book[]> {
    const collection = await this.databaseProvider.query(ByTypeAndStatus(name, status), Index.STATUS, pagination);

    return collection.map((record) => {
      return {
        bookId: record["resourceId"].split("#")[1],
        authorId: record["subResourceId"].split("#")[1],
        status: record["status"],
        title: record["title"],
        isbn: record["isbn"],
      };
    });
  }

  protected getFormattedKey(primaryKey: BookPrimaryKey): PrimaryKey {
    return {
      resourceId: `Book#${primaryKey.bookId}`,
      subResourceId: `Author#${primaryKey.authorId}`,
    };
  }
}

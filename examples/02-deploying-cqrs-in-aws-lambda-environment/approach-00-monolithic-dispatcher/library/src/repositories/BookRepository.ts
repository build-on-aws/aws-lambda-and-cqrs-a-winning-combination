/* eslint @typescript-eslint/no-unused-vars: 0 */
import KSUID from "ksuid";
import { IRepository } from "./IRepository";
import { Book, BookKey, BookStatus, BookUpdateModel } from "../models/Book";

export class BookRepository implements IRepository<Book, BookUpdateModel, BookKey> {
  create(model: Book): Book {
    const ksuid = KSUID.randomSync().string;

    return {
      bookId: ksuid,
      authorId: model.authorId,
      title: model.title,
      isbn: model.isbn,
      status: model.status,
    };
  }

  read(primaryKey: BookKey): Book {
    return {
      bookId: primaryKey.bookId,
      authorId: primaryKey.authorId,
      title: "",
      isbn: "",
      status: BookStatus.NOT_AVAILABLE,
    };
  }

  update(primaryKey: BookKey, model: BookUpdateModel): Book {
    return {
      bookId: primaryKey.bookId,
      authorId: primaryKey.authorId,
      title: model.title ?? "",
      isbn: model.isbn ?? "",
      status: model.status ?? BookStatus.NOT_AVAILABLE,
    };
  }

  delete(primaryKey: BookKey): BookKey {
    return {
      bookId: primaryKey.bookId,
      authorId: primaryKey.authorId,
    };
  }

  queryByTypeAndSortKey(entityName: string, sortKey: string): Book[] {
    return [];
  }

  queryByTypeAndStatus(entityName: string, status: string): Book[] {
    return [];
  }
}

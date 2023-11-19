import { Author } from "./Author";

export enum BookStatus {
  AVAILABLE = "AVAILABLE",
  NOT_AVAILABLE = "NOT_AVAILABLE",
  MISSING = "MISSING",
}

export type Book = {
  bookId: string;
  authorId: string;
  title: string;
  isbn: string;
  status: BookStatus;
};

export type BookCreateModel = {
  author: Author;
  title: string;
  isbn: string;
};

export type BookUpdateModel = {
  title?: string;
  isbn?: string;
  status?: BookStatus;
};

export type BookKey = {
  bookId: string;
  authorId: string;
};

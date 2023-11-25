export enum BookStatus {
  AVAILABLE = "AVAILABLE",
  NOT_AVAILABLE = "NOT_AVAILABLE",
  MISSING = "MISSING",
}

export type BookRequestPayload = {
  title: string;
  isbn: string;
};

export type Book = {
  bookId: string;
  authorId: string;
  title: string;
  isbn: string;
  status: BookStatus;
};

export type BookUpdateModel = {
  title?: string;
  isbn?: string;
  status?: BookStatus;
};

export type BookPrimaryKey = {
  bookId: string;
  authorId: string;
};

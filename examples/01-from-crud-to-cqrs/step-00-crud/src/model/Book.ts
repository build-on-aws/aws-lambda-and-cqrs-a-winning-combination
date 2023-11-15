import { Author } from './Author';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

export class Book extends BaseEntity {
  title: string;
  isbn: string;
  author: Author;
  borrower?: User;
  status: BookStatus = BookStatus.AVAILABLE;

  constructor(title: string, isbn: string, author: Author, borrower: User, status: BookStatus) {
    super();
    this.title = title;
    this.isbn = isbn;
    this.author = author;
    this.borrower = borrower;
    this.status = status;
  }
}

export enum BookStatus {
  AVAILABLE = "AVAILABLE",
  BORROWED = "BORROWED",
  MISSING = "MISSING"
}

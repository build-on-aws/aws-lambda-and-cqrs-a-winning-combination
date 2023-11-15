import attribute from 'dynamode/decorators';
import { Author } from "./Author";
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './base/LibraryTable';

type BookProps = LibraryTableProps & {
  status: BookStatus;
  title: string;
  isbn: string;
};

export class Book extends LibraryTable {
  @attribute.partitionKey.string({ prefix: Author.name }) // `Author#${authorId}`
  resourceId!: string;

  @attribute.sortKey.string({ prefix: Book.name }) // `Book#${bookId}`
  subResourceId!: string;

  @attribute.string()
  status: BookStatus;

  @attribute.string()
  title: string;

  @attribute.string()
  isbn: string;

  constructor(props: BookProps) {
    super(props);

    this.status = props.status;
    this.title = props.title;
    this.isbn = props.isbn;
  }

  static getPrimaryKey(authorId: string, bookId: string): LibraryTablePrimaryKey {
    return {
      resourceId: authorId,
      subResourceId: bookId
    };
  }
}

export enum BookStatus {
  AVAILABLE = "AVAILABLE",
  NOT_AVAILABLE = "NOT_AVAILABLE",
  MISSING = "MISSING"
}

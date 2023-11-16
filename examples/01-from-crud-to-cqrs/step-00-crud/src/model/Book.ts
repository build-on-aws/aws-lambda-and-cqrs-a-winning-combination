import attribute from 'dynamode/decorators';
import KSUID from "ksuid";
import { Author } from "./Author";
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './base/LibraryTable';
import { BookMapping } from "../mapping/BookMapping";
import { IMappable } from "../mapping/interfaces/IMappable";
import { IUpdateable } from "../mapping/interfaces/IUpdateable";

type BookFields = {
  title: string;
  isbn: string;
  status: BookStatus;
};

type BookProps = LibraryTableProps & BookFields;

export class Book extends LibraryTable implements IMappable, IUpdateable {
  @attribute.partitionKey.string({ prefix: Author.name }) // `Author#${authorId}`
  resourceId!: string;

  @attribute.sortKey.string({ prefix: Book.name }) // `Book#${bookId}`
  subResourceId!: string;

  @attribute.string()
  title: string;

  @attribute.string()
  isbn: string;

  @attribute.string()
  status: BookStatus;

  constructor(props: BookProps) {
    super(props);

    this.title = props.title;
    this.isbn = props.isbn;
    this.status = props.status;
  }

  toMapping(): BookMapping {
    return BookMapping.fromEntity(this);
  }

  toUpdateStructure(): { set: BookFields } {
    return {
      set: {
        title: this.title,
        isbn: this.isbn,
        status: this.status
      }
    };
  }

  static fromMapping(authorId: KSUID, bookId: KSUID, mapping: BookMapping): Book {
    return new Book({
      ...Book.getPrimaryKey(authorId.string, bookId.string),
      title: mapping.title,
      isbn: mapping.isbn,
      status: BookStatus[(mapping.status ?? BookStatus.AVAILABLE) as keyof typeof BookStatus],
    })
  }

  static fromCompleteMapping(mapping: BookMapping): Book {
    return Book.fromMapping(KSUID.parse(mapping.authorId!), KSUID.parse(mapping.id!), mapping);
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

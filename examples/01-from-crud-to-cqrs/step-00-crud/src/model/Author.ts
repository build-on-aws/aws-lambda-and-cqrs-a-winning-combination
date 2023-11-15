import attribute from 'dynamode/decorators';
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './LibraryTable';

type AuthorProps = LibraryTableProps & {
  name: string;
  birthdate: Date;
};

export class Author extends LibraryTable {
  @attribute.partitionKey.string({ prefix: Author.name }) // `Author#${authorId}`
  pk!: string;

  @attribute.sortKey.string({ prefix: Author.name }) // `Author#${authorId}`
  sk!: string;

  @attribute.string()
  name: string;

  @attribute.date.string()
  birthdate: Date;

  constructor(props: AuthorProps) {
    super(props);

    this.type = Author.name;

    this.name = props.name;
    this.birthdate = props.birthdate;
  }

  static getPrimaryKey(authorId: string): LibraryTablePrimaryKey {
    return {
      pk: authorId,
      sk: authorId
    };
  }
}

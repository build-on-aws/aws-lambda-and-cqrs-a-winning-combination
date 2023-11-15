import attribute from 'dynamode/decorators';
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './base/LibraryTable';

type AuthorProps = LibraryTableProps & {
  name: string;
  birthdate: Date;
};

export class Author extends LibraryTable {
  @attribute.partitionKey.string({ prefix: Author.name }) // `Author#${authorId}`
  resourceId!: string;

  @attribute.sortKey.string({ prefix: Author.name }) // `Author#${authorId}`
  subResourceId!: string;

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
      resourceId: authorId,
      subResourceId: authorId
    };
  }
}

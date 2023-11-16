import attribute from 'dynamode/decorators';
import KSUID from 'ksuid';
import moment from 'moment';
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './base/LibraryTable';
import { AuthorMapping } from '../mapping/AuthorMapping';
import { IMappable } from "../mapping/interfaces/IMappable";
import { IUpdateable } from "../mapping/interfaces/IUpdateable";

type AuthorFields = {
  name: string;
  birthdate: Date;
};

type AuthorProps = LibraryTableProps & AuthorFields;

export class Author extends LibraryTable implements IMappable, IUpdateable {
  @attribute.partitionKey.string({ prefix: Author.name }) // `Author#${authorId}`
  resourceId!: string;

  @attribute.sortKey.string({ prefix: Author.name }) // `Author#${authorId}`
  subResourceId!: string;

  @attribute.string()
  name: string;

  @attribute.date.string()
  birthdate: Date;

  protected constructor(props: AuthorProps) {
    super(props);

    this.name = props.name;
    this.birthdate = props.birthdate;
  }

  toMapping(): AuthorMapping {
    return AuthorMapping.fromEntity(this);
  }

  toUpdateStructure(): { set: AuthorFields } {
    return {
      set: {
        name: this.name,
        birthdate: this.birthdate
      }
    };
  }

  static fromMapping(id: KSUID, mapping: AuthorMapping): Author {
    return new Author({
      ...Author.getPrimaryKey(id.string),
      name: mapping.name,
      birthdate: moment(mapping.birthdate).toDate()
    })
  }

  static fromCompleteMapping(mapping: AuthorMapping): Author {
    return Author.fromMapping(KSUID.parse(mapping.id!), mapping);
  }

  static getPrimaryKey(authorId: string): LibraryTablePrimaryKey {
    return {
      resourceId: authorId,
      subResourceId: authorId
    };
  }
}

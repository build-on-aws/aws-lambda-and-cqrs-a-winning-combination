import attribute from 'dynamode/decorators';
import KSUID from 'ksuid';
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './base/LibraryTable';
import { UserMapping } from '../mapping/UserMapping';
import { IMappable } from '../mapping/interfaces/IMappable';
import { IUpdateable } from '../mapping/interfaces/IUpdateable';

type UserFields = {
  name: string;
  email: string;
  status: UserStatus;
  comment: string;
};

type UserProps = LibraryTableProps & UserFields;

export class User extends LibraryTable implements IMappable, IUpdateable {
  @attribute.partitionKey.string({ prefix: User.name }) // `User#${userId}`
  resourceId!: string;

  @attribute.sortKey.string({ prefix: User.name }) // `User#${userId}`
  subResourceId!: string;

  @attribute.string()
  name: string;

  @attribute.string()
  email: string;

  @attribute.string()
  status: UserStatus;

  @attribute.string()
  comment: string;

  constructor(props: UserProps) {
    super(props);

    this.name = props.name;
    this.email = props.email;
    this.status = props.status;
    this.comment = props.comment;
  }

  toMapping(): UserMapping {
    return UserMapping.fromEntity(this);
  }

  toUpdateStructure(): { set: UserFields } {
    return {
      set: {
        name: this.name,
        email: this.email,
        status: this.status,
        comment: this.comment
      }
    };
  }

  static fromMapping(id: KSUID, mapping: UserMapping): User {
    return new User({
      ...User.getPrimaryKey(id.string),
      name: mapping.name,
      email: mapping.email,
      status: UserStatus[(mapping.status ?? UserStatus.NOT_VERIFIED) as keyof typeof UserStatus],
      comment: mapping.comment ?? ''
    })
  }

  static fromCompleteMapping(mapping: UserMapping): User {
    return User.fromMapping(KSUID.parse(mapping.id!), mapping);
  }

  static getPrimaryKey(userId: string): LibraryTablePrimaryKey {
    return {
      resourceId: userId,
      subResourceId: userId
    };
  }
}

export enum UserStatus {
  NOT_VERIFIED = 'NOT_VERIFIED',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED'
}


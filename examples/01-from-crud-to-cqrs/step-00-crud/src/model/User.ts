import attribute from 'dynamode/decorators';
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './base/LibraryTable';

type UserProps = LibraryTableProps & {
  name: string;
  email: string;
  status: UserStatus;
  comment: string;
};

export class User extends LibraryTable {
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

    this.type = User.name;

    this.name = props.name;
    this.email = props.email;
    this.status = props.status;
    this.comment = props.comment;
  }

  static getPrimaryKey(userId: string): LibraryTablePrimaryKey {
    return {
      resourceId: userId,
      subResourceId: userId
    };
  }
}

export enum UserStatus {
  NOT_VERIFIED = "NOT VERIFIED",
  VERIFIED = "VERIFIED",
  SUSPENDED = "SUSPENDED"
}


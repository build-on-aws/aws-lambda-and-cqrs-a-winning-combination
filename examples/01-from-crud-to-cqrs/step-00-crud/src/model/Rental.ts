import attribute from 'dynamode/decorators';
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './LibraryTable';
import { User } from "./User";

type RentalProps = LibraryTableProps & {
  name: string;
  email: string;
  status: RentalStatus;
  comment: string;
};

export class Rental extends LibraryTable {
  @attribute.partitionKey.string({ prefix: User.name }) // `User#${userId}`
  pk!: string;

  @attribute.sortKey.string({ prefix: Rental.name }) // `Rental#${bookId}`
  sk!: string;

  @attribute.string()
  name: string;

  @attribute.string()
  email: string;

  @attribute.string()
  status: RentalStatus;

  @attribute.string()
  comment: string;

  constructor(props: RentalProps) {
    super(props);

    this.type = Rental.name;

    this.name = props.name;
    this.email = props.email;
    this.status = props.status;
    this.comment = props.comment;
  }

  static getPrimaryKey(userId: string, bookId: string): LibraryTablePrimaryKey {
    return {
      pk: userId,
      sk: bookId
    };
  }
}

export enum RentalStatus {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED"
}

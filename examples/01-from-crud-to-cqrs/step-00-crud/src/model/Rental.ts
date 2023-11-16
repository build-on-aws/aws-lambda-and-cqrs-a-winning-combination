import attribute from 'dynamode/decorators';
import KSUID from "ksuid";
import { LibraryTable, LibraryTablePrimaryKey, LibraryTableProps } from './base/LibraryTable';
import { User } from "./User";
import { RentalMapping } from "../mapping/RentalMapping";
import { IMappable } from "../mapping/interfaces/IMappable";
import { IUpdateable } from "../mapping/interfaces/IUpdateable";

type RentalFields = {
  name: string;
  email: string;
  status: RentalStatus;
  comment: string;
};

type RentalProps = LibraryTableProps & RentalFields;

export class Rental extends LibraryTable implements IMappable, IUpdateable {
  @attribute.partitionKey.string({ prefix: User.name }) // `User#${userId}`
  resourceId!: string;

  @attribute.sortKey.string({ prefix: Rental.name }) // `Rental#${bookId}`
  subResourceId!: string;

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

    this.name = props.name;
    this.email = props.email;
    this.status = props.status;
    this.comment = props.comment;
  }

  toMapping(): RentalMapping {
    return RentalMapping.fromEntity(this);
  }

  toUpdateStructure(): { set: RentalFields } {
    return {
      set: {
        name: this.name,
        email: this.email,
        status: this.status,
        comment: this.comment
      }
    };
  }

  static fromMapping(userId: KSUID, bookId: KSUID, mapping: RentalMapping): Rental {
    return new Rental({
      ...Rental.getPrimaryKey(userId.string, bookId.string),
      name: mapping.name,
      email: mapping.email,
      status: RentalStatus[(mapping.status ?? RentalStatus.BORROWED) as keyof typeof RentalStatus],
      comment: mapping.comment ?? ""
    })
  }

  static fromCompleteMapping(mapping: RentalMapping): Rental {
    return Rental.fromMapping(KSUID.parse(mapping.userId!), KSUID.parse(mapping.bookId!), mapping);
  }

  static getPrimaryKey(userId: string, bookId: string): LibraryTablePrimaryKey {
    return {
      resourceId: userId,
      subResourceId: bookId
    };
  }
}

export enum RentalStatus {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED"
}

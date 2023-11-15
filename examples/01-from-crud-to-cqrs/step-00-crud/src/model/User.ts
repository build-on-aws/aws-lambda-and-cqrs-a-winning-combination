import { BaseEntity } from './BaseEntity';
import { Book } from './Book';

export class User extends BaseEntity {
  email: string;
  name: string;
  status: UserStatus = UserStatus.NOT_VERIFIED;
  comment: string;
  borrowedBooks? = [Book];

  constructor(name: string, email: string, status: UserStatus, comment: string) {
    super();
    this.name = name;
    this.email = email;
    this.status = status;
    this.comment = comment;
  }
}

export enum UserStatus {
  NOT_VERIFIED = "NOT VERIFIED",
  VERIFIED = "VERIFIED",
  BLOCKED = "BLOCKED"
}

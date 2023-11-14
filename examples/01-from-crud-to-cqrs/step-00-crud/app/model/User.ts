import { BaseEntity } from './BaseEntity';
import { Book } from './Book';

export class User extends BaseEntity {
  name: string;
  email: string;
  status: UserStatus = UserStatus.NOT_VERIFIED;
  statusComment: string;
  borrowedBooks? = [Book];

  constructor(name: string, email: string, status: UserStatus, statusComment: string) {
    super();
    this.name = name;
    this.email = email;
    this.status = status;
    this.statusComment = statusComment;
  }
}

export enum UserStatus {
  NOT_VERIFIED = "NOT VERIFIED",
  VERIFIED = "VERIFIED",
  BLOCKED = "BLOCKED"
}

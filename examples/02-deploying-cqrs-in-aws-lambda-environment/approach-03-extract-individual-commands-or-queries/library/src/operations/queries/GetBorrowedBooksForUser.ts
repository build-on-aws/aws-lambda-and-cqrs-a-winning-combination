import { IQuery } from "./IQuery";

export class GetBorrowedBooksForUser extends IQuery {
  public readonly userId: string;

  constructor(requestId: string, userId: string) {
    super(requestId);

    this.userId = userId;
  }
}

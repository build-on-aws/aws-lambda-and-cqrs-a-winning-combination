import { ICommand } from "./ICommand";

export class BorrowBookCommand extends ICommand {
  public readonly bookId: string;
  public readonly userId: string;

  constructor(requestId: string, bookId: string, userId: string) {
    super(requestId);

    this.bookId = bookId;
    this.userId = userId;
  }
}

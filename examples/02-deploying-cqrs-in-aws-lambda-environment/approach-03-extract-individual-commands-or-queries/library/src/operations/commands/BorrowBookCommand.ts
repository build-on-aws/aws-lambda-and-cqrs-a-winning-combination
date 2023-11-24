import { ICommand } from "./ICommand";
import { BorrowBookCommandRequest } from "../../payloads/requests";

export class BorrowBookCommand extends ICommand {
  public readonly bookId: string;
  public readonly borrowBookParameters: BorrowBookCommandRequest;

  constructor(requestId: string, bookId: string, payload: string) {
    super(requestId);

    this.bookId = bookId;

    const parsedPayload = JSON.parse(payload);

    this.borrowBookParameters = {
      userId: parsedPayload.userId,
    };
  }
}

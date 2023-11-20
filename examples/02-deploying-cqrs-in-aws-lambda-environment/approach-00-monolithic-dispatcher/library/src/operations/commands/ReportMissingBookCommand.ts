import { ICommand } from "./ICommand";
import { ReportMissingBookCommandRequest } from "../../payloads/requests";

export class ReportMissingBookCommand extends ICommand {
  public readonly bookId: string;
  public readonly missingBookParameters: ReportMissingBookCommandRequest;

  constructor(requestId: string, bookId: string, payload: string) {
    super(requestId);

    this.bookId = bookId;

    const parsedPayload = JSON.parse(payload);

    this.missingBookParameters = {
      authorId: parsedPayload.authorId,
      userId: parsedPayload.userId,
    };
  }
}

import { ICommand } from "./ICommand";
import { BookCreateModel } from "../../models/Book";

export class AddNewBookCommand extends ICommand {
  public readonly book: BookCreateModel;

  constructor(requestId: string, payload: string) {
    super(requestId);

    const parsedPayload = JSON.parse(payload);

    this.book = {
      author: parsedPayload.author,
      isbn: parsedPayload.isbn,
      title: parsedPayload.title,
    };
  }
}

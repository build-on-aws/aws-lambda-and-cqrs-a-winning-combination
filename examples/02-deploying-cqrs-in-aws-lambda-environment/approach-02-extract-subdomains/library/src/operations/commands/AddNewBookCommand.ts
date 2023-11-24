import { ICommand } from "./ICommand";
import { AddNewBookCommandRequest } from "../../payloads/requests";

export class AddNewBookCommand extends ICommand {
  public readonly newBookParameters: AddNewBookCommandRequest;

  constructor(requestId: string, payload: string) {
    super(requestId);

    const parsedPayload = JSON.parse(payload);

    this.newBookParameters = {
      author: parsedPayload.author,
      isbn: parsedPayload.isbn,
      title: parsedPayload.title,
    };
  }
}

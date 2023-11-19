import { IQuery } from "./IQuery";

export class GetBooksByAuthor extends IQuery {
  public readonly authorId: string;

  constructor(requestId: string, authorId: string) {
    super(requestId);

    this.authorId = authorId;
  }
}

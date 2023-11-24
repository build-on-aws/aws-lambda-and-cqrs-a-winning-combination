import { IQuery } from "./IQuery";

export class GetMissingBooks extends IQuery {
  public readonly status: string;

  constructor(requestId: string, status: string) {
    super(requestId);

    this.status = status;
  }
}

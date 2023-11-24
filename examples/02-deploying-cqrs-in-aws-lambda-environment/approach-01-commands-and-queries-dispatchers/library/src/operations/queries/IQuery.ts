import { BaseHandler } from "../BaseHandler";

export abstract class IQuery extends BaseHandler {
  protected constructor(requestId: string) {
    super(requestId);
  }
}

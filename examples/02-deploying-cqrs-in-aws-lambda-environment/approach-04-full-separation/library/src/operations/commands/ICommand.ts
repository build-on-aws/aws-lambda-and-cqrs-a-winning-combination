import { BaseHandler } from "../BaseHandler";

export abstract class ICommand extends BaseHandler {
  protected constructor(requestId: string) {
    super(requestId);
  }
}

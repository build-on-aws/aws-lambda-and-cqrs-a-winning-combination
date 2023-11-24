export abstract class BaseHandler {
  protected readonly requestId: string;

  protected constructor(requestId: string) {
    this.requestId = requestId;
  }
}

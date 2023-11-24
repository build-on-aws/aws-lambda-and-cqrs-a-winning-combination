export class UnrecognizedOperation extends Error {
  constructor(type: string, name: string, requestId: string) {
    super(`Unrecognized Operation - ${type}: ${name} (AWS Request ID: ${requestId})`);

    this.name = UnrecognizedOperation.name;
  }
}

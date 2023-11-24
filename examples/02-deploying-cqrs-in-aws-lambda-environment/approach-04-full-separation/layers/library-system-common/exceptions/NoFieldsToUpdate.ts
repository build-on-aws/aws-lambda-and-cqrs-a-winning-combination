export class NoFieldsToUpdate extends Error {
  constructor(message: string) {
    super(message);

    this.name = NoFieldsToUpdate.name;
  }
}

export class EntityNotFound extends Error {
  constructor(message: string) {
    super(message);

    this.name = EntityNotFound.name;
  }
}

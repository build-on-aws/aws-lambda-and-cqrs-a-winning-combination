export class MappingValidationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = MappingValidationError.name;
  }
}

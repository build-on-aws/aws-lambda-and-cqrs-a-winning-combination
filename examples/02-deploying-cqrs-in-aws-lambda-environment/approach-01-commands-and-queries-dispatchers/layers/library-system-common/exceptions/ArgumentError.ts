export class ArgumentError extends Error {
  constructor(message: string) {
    super(message);

    this.name = ArgumentError.name;
  }
}

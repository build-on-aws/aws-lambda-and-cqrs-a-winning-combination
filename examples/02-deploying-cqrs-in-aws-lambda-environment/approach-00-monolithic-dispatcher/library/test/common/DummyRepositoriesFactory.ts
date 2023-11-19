import { ArgumentError } from "../../src/exceptions/ArgumentError";
import { IRepositoryFactory } from "../../src/factories/base/IRepositoryFactory";
import { AuthorRepository, BookRepository, IRepository, RentalRepository } from "../../src/repositories";

export class DummyRepositoriesFactory implements IRepositoryFactory<any, any, any> {
  createRepositoryFor(entityName: string): IRepository<any, any, any> {
    switch (entityName) {
      case "Author":
        return new AuthorRepository();

      case "Book":
        return new BookRepository();

      case "Rental":
        return new RentalRepository();
    }

    throw new ArgumentError(`Unrecognized repository creation for entity: ${entityName}`);
  }
}

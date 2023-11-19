import { ArgumentError } from "../exceptions/ArgumentError";
import { IRepositoryFactory } from "./base/IRepositoryFactory";
import { AuthorRepository, BookRepository, IRepository, RentalRepository, UserRepository } from "../repositories";

export class RepositoriesFactory implements IRepositoryFactory<any, any, any> {
  createRepositoryFor(entityName: string): IRepository<any, any, any> {
    switch (entityName) {
      case "Author":
        return new AuthorRepository();

      case "Book":
        return new BookRepository();

      case "Rental":
        return new RentalRepository();

      case "User":
        return new UserRepository();
    }

    throw new ArgumentError(`Unrecognized repository creation for entity: ${entityName}`);
  }
}

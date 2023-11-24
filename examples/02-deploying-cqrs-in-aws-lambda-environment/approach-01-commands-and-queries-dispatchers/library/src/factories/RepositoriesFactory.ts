import { ArgumentError } from "library-system-common/exceptions";
import { IDatabaseProvider } from "library-system-common/database/IDatabaseProvider";
import { AuthorRepository, BookRepository, RentalRepository, UserRepository } from "library-system-common/repositories";

export class RepositoriesFactory {
  private readonly databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  createRepositoryFor(entityName: string) {
    switch (entityName) {
      case "Author":
        return new AuthorRepository(this.databaseProvider);

      case "Book":
        return new BookRepository(this.databaseProvider);

      case "Rental":
        return new RentalRepository(this.databaseProvider);

      case "User":
        return new UserRepository(this.databaseProvider);
    }

    throw new ArgumentError(`Unrecognized repository creation for entity: ${entityName}`);
  }
}

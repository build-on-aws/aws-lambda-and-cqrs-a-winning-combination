import { ArgumentError } from "library-system-common/exceptions";
import { DispatcherContext } from "../dispatchers/CommandsDispatcher";
import { RepositoriesFactory } from "./RepositoriesFactory";
import { GetBooksByAuthor, GetBorrowedBooksForUser, GetMissingBooks } from "../operations/queries";
import { GetBooksByAuthorHandler, GetBorrowedBooksForUserHandler, GetMissingBooksHandler } from "../handlers/queries";
import { BookStatus, RentalStatus } from "library-system-common/models";
import { BookRepository, RentalRepository } from "library-system-common/repositories";

const PATHS = {
  GetBooksByAuthor: "/book/by-author/{authorId}",
  GetBorrowedBooksForUser: "/book/by-user/{userId}",
  GetMissingBooks: "/book",
};

export class QueryHandlersFactory {
  static async createAndHandle(context: DispatcherContext, repositoriesFactory: RepositoriesFactory) {
    switch (context.resource) {
      case PATHS.GetBooksByAuthor: {
        if (!context.pathParameters.authorId) {
          throw new ArgumentError("No author ID provided for GetBooksByAuthor query");
        }

        const query = new GetBooksByAuthor(context.requestId, context.pathParameters.authorId);
        const handler = new GetBooksByAuthorHandler(repositoriesFactory.createRepositoryFor("Book") as BookRepository);

        return handler.handle(query);
      }

      case PATHS.GetBorrowedBooksForUser: {
        if (!context.pathParameters.userId) {
          throw new ArgumentError("No user ID provided for GetBorrowedBooksForUser query");
        }

        if (!context.queryParameters.status || context.queryParameters.status.toUpperCase() !== RentalStatus.BORROWED) {
          throw new ArgumentError("Invalid status provided for GetBorrowedBooksForUser query");
        }

        const query = new GetBorrowedBooksForUser(context.requestId, context.pathParameters.userId);
        const handler = new GetBorrowedBooksForUserHandler(
          repositoriesFactory.createRepositoryFor("Rental") as RentalRepository,
        );

        return handler.handle(query);
      }

      case PATHS.GetMissingBooks: {
        if (!context.queryParameters.status || context.queryParameters.status.toUpperCase() !== BookStatus.MISSING) {
          throw new ArgumentError("Invalid status provided for GetMissingBooks query");
        }

        const query = new GetMissingBooks(context.requestId, context.queryParameters.status.toUpperCase());
        const handler = new GetMissingBooksHandler(repositoriesFactory.createRepositoryFor("Book") as BookRepository);

        return handler.handle(query);
      }
    }

    throw new ArgumentError(`Unrecognized query for '${context.resource}'`);
  }
}

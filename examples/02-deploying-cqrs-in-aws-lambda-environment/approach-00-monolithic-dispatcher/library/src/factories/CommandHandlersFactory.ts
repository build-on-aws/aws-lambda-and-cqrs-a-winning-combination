import { DispatcherContext } from "../dispatcher/Dispatcher";
import { ArgumentError } from "../exceptions/ArgumentError";
import { RepositoriesFactory } from "./RepositoriesFactory";
import { AddNewBookCommand, BorrowBookCommand, ReportMissingBookCommand } from "../operations/commands";
import { AddNewBookHandler, BorrowBookHandler, ReportMissingBookHandler } from "../handlers/commands";

const PATHS = {
  AddNewBook: "/book/new",
  BorrowBook: "/book/{bookId}/borrow/{userId}",
  ReportMissingBook: "/book/{bookId}/missing/{userId}",
};

export class CommandHandlersFactory {
  static createAndHandle(context: DispatcherContext, repositoriesFactory: RepositoriesFactory) {
    switch (context.resource) {
      case PATHS.AddNewBook: {
        if (!context.payload) {
          throw new ArgumentError("No payload provided for AddNewBook command");
        }

        const command = new AddNewBookCommand(context.requestId, context.payload);
        const handler = new AddNewBookHandler(
          repositoriesFactory.createRepositoryFor("Book"),
          repositoriesFactory.createRepositoryFor("Author"),
        );

        return handler.handle(command);
      }

      case PATHS.BorrowBook: {
        if (!context.pathParameters.bookId) {
          throw new ArgumentError("No book ID provided for BorrowBook command");
        }

        if (!context.pathParameters.userId) {
          throw new ArgumentError("No user ID provided for BorrowBook command");
        }

        const command = new BorrowBookCommand(
          context.requestId,
          context.pathParameters.bookId,
          context.pathParameters.userId,
        );
        const handler = new BorrowBookHandler(
          repositoriesFactory.createRepositoryFor("Rental"),
          repositoriesFactory.createRepositoryFor("User"),
          repositoriesFactory.createRepositoryFor("Book"),
        );

        return handler.handle(command);
      }

      case PATHS.ReportMissingBook: {
        if (!context.pathParameters.bookId) {
          throw new ArgumentError("No book ID provided for ReportMissingBook command");
        }

        if (!context.pathParameters.userId) {
          throw new ArgumentError("No user ID provided for ReportMissingBook command");
        }

        const command = new ReportMissingBookCommand(
          context.requestId,
          context.pathParameters.bookId,
          context.pathParameters.userId,
        );
        const handler = new ReportMissingBookHandler(
          repositoriesFactory.createRepositoryFor("Book"),
          repositoriesFactory.createRepositoryFor("User"),
          repositoriesFactory.createRepositoryFor("Rental"),
        );

        return handler.handle(command);
      }
    }

    throw new ArgumentError(`Unrecognized command for '${context.resource}'`);
  }
}

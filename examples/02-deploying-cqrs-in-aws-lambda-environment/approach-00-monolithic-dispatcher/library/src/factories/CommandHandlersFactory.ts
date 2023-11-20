import { DispatcherContext } from "../dispatcher/Dispatcher";
import { ArgumentError } from "../exceptions/ArgumentError";
import { RepositoriesFactory } from "./RepositoriesFactory";
import { AddNewBookCommand, BorrowBookCommand, ReportMissingBookCommand } from "../operations/commands";
import { AddNewBookHandler, BorrowBookHandler, ReportMissingBookHandler } from "../handlers/commands";
import { AuthorRepository, BookRepository, RentalRepository, UserRepository } from "../repositories";

const PATHS = {
  AddNewBook: "/book/new",
  BorrowBook: "/book/{bookId}/borrow",
  ReportMissingBook: "/book/{bookId}/missing",
};

export class CommandHandlersFactory {
  static async createAndHandle(context: DispatcherContext, repositoriesFactory: RepositoriesFactory) {
    switch (context.resource) {
      case PATHS.AddNewBook: {
        if (!context.payload) {
          throw new ArgumentError("No payload provided for AddNewBook command");
        }

        const command = new AddNewBookCommand(context.requestId, context.payload);
        const handler = new AddNewBookHandler(
          repositoriesFactory.createRepositoryFor("Book") as BookRepository,
          repositoriesFactory.createRepositoryFor("Author") as AuthorRepository,
        );

        return handler.handle(command);
      }

      case PATHS.BorrowBook: {
        if (!context.pathParameters.bookId) {
          throw new ArgumentError("No book ID provided for BorrowBook command");
        }

        if (!context.payload) {
          throw new ArgumentError("No payload provided for BorrowBook command");
        }

        const command = new BorrowBookCommand(context.requestId, context.pathParameters.bookId, context.payload);
        const handler = new BorrowBookHandler(
          repositoriesFactory.createRepositoryFor("Rental") as RentalRepository,
          repositoriesFactory.createRepositoryFor("User") as UserRepository,
        );

        return handler.handle(command);
      }

      case PATHS.ReportMissingBook: {
        if (!context.pathParameters.bookId) {
          throw new ArgumentError("No book ID provided for ReportMissingBook command");
        }

        if (!context.payload) {
          throw new ArgumentError("No payload provided for ReportMissingBook command");
        }

        const command = new ReportMissingBookCommand(context.requestId, context.pathParameters.bookId, context.payload);
        const handler = new ReportMissingBookHandler(
          repositoriesFactory.createRepositoryFor("Book") as BookRepository,
          repositoriesFactory.createRepositoryFor("User") as UserRepository,
          repositoriesFactory.createRepositoryFor("Rental") as RentalRepository,
        );

        return handler.handle(command);
      }
    }

    throw new ArgumentError(`Unrecognized command for '${context.resource}'`);
  }
}

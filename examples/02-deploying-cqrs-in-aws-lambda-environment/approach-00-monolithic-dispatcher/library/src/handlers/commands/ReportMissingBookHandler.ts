import { ICommandHandler } from "./ICommandHandler";
import { ReportMissingBookCommand } from "../../operations/commands";
import { ReportMissingBookCommandResponse } from "../../responses";
import { BookRepository, RentalRepository, UserRepository } from "../../repositories";
import { ArgumentError } from "../../exceptions/ArgumentError";
import { BookStatus } from "../../models/Book";
import { UserStatus } from "../../models/User";
import moment from "moment";
import { RentalStatus } from "../../models/Rental";

export class ReportMissingBookHandler
  implements ICommandHandler<ReportMissingBookCommand, ReportMissingBookCommandResponse>
{
  private readonly bookRepository;
  private readonly userRepository;
  private readonly rentalRepository;

  constructor(bookRepository: BookRepository, userRepository: UserRepository, rentalRepository: RentalRepository) {
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
    this.rentalRepository = rentalRepository;
  }

  handle(operation: ReportMissingBookCommand): ReportMissingBookCommandResponse {
    const rentals = this.rentalRepository.queryByTypeAndStatus("Rental", RentalStatus.BORROWED);

    if (rentals.filter((rental) => rental.bookId === operation.bookId).length === 0) {
      throw new ArgumentError(`Book is not missing, as it is still available: ${operation.bookId}`);
    }

    const offender = this.userRepository.read({ id: operation.userId });

    const availableBooks = this.bookRepository.queryByTypeAndStatus("Book", BookStatus.AVAILABLE);
    const affectedBook = availableBooks.filter((book) => book.bookId === operation.bookId)[0];
    const authorId = affectedBook.authorId;

    this.bookRepository.update({ bookId: operation.bookId, authorId }, { status: BookStatus.MISSING });

    const comment = `Suspended due to missing book ${operation.bookId} at ${moment().toISOString()}`;
    this.userRepository.update({ id: operation.userId }, { status: UserStatus.SUSPENDED, comment });

    this.rentalRepository.delete({ bookId: operation.bookId, userId: operation.userId });

    return { success: true, bookId: operation.bookId, userId: offender.id };
  }
}

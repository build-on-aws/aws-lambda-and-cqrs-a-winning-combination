import moment from "moment";
import { ICommandHandler } from "./ICommandHandler";
import { ReportMissingBookCommand } from "../../operations/commands";
import { ReportMissingBookCommandResponse } from "../../payloads/responses";
import { BookRepository, RentalRepository, UserRepository } from "../../repositories";
import { ArgumentError } from "../../exceptions/ArgumentError";
import { BookStatus } from "../../models/Book";
import { UserStatus } from "../../models/User";
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

  async handle(operation: ReportMissingBookCommand): Promise<ReportMissingBookCommandResponse> {
    const bookId = operation.bookId;
    const authorIdForMissingBook = operation.missingBookParameters.authorId;
    const offenderId = operation.missingBookParameters.userId;

    // Checking if a given user exists.
    await this.userRepository.read({ id: offenderId });

    // Checking if a given book is not still available (as it has to be rented to be missing).
    const rentals = await this.rentalRepository.queryByTypeAndStatus("Rental", RentalStatus.BORROWED);

    if (rentals.filter((rental) => rental.bookId === bookId).length === 0) {
      throw new ArgumentError(`Book is not missing, as it is still available: ${bookId}`);
    }

    // Mark this book as missing.
    await this.bookRepository.update({ bookId, authorId: authorIdForMissingBook }, { status: BookStatus.MISSING });

    // Suspend the offending user.
    const comment = `Suspended due to missing book ${bookId} at ${moment().toISOString()}`;
    await this.userRepository.update({ id: offenderId }, { status: UserStatus.SUSPENDED, comment });

    // Remove the rental.
    await this.rentalRepository.delete({ bookId, userId: offenderId });

    return { success: true, bookId: operation.bookId, userId: offenderId };
  }
}

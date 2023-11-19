import moment from "moment";
import { ICommandHandler } from "./ICommandHandler";
import { ReportMissingBookCommand } from "../../operations/commands";
import { BorrowBookCommandResponse } from "../../responses";
import { BookRepository, RentalRepository, UserRepository } from "../../repositories";
import { ArgumentError } from "../../exceptions/ArgumentError";
import { RentalStatus } from "../../models/Rental";

export class BorrowBookHandler implements ICommandHandler<ReportMissingBookCommand, BorrowBookCommandResponse> {
  private readonly rentalRepository;
  private readonly userRepository;
  private readonly bookRepository;

  constructor(rentalRepository: RentalRepository, userRepository: UserRepository, bookRepository: BookRepository) {
    this.rentalRepository = rentalRepository;
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
  }

  handle(operation: ReportMissingBookCommand): BorrowBookCommandResponse {
    const rentals = this.rentalRepository.queryByTypeAndStatus("Rental", RentalStatus.BORROWED);

    if (rentals.filter((rental) => rental.bookId === operation.bookId).length > 0) {
      throw new ArgumentError(`Book is already borrowed: ${operation.bookId}`);
    }

    const borrower = this.userRepository.read({ id: operation.userId });

    const comment = `Borrowed by ${borrower.id} at ${moment().toISOString()}`;
    const status = RentalStatus.BORROWED;
    this.rentalRepository.create({ bookId: operation.bookId, userId: operation.userId, status, comment });

    return { success: true, bookId: operation.bookId, userId: borrower.id };
  }
}

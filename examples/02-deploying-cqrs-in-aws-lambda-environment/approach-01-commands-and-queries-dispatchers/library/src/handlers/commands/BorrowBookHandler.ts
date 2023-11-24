import moment from "moment";
import { ICommandHandler } from "./ICommandHandler";
import { BorrowBookCommand } from "../../operations/commands";
import { BorrowBookCommandResponse } from "../../payloads/responses";
import { RentalRepository, UserRepository } from "library-system-common/repositories";
import { ArgumentError } from "library-system-common/exceptions";
import { RentalStatus } from "library-system-common/models";

export class BorrowBookHandler implements ICommandHandler<BorrowBookCommand, BorrowBookCommandResponse> {
  private readonly rentalRepository;
  private readonly userRepository;

  constructor(rentalRepository: RentalRepository, userRepository: UserRepository) {
    this.rentalRepository = rentalRepository;
    this.userRepository = userRepository;
  }

  async handle(operation: BorrowBookCommand): Promise<BorrowBookCommandResponse> {
    const bookId = operation.bookId;
    const borrowerId = operation.borrowBookParameters.userId;

    // Checking if a given user exists.
    await this.userRepository.read({ id: borrowerId });

    // Checking if a given book is not already borrowed.
    const rentals = await this.rentalRepository.queryByTypeAndStatus("Rental", RentalStatus.BORROWED);

    if (rentals.filter((rental) => rental.bookId === bookId).length > 0) {
      throw new ArgumentError(`Book is already borrowed: ${bookId}`);
    }

    // Performing an actual borrow.
    const comment = `Borrowed by ${borrowerId} at ${moment().toISOString()}`;
    const status = RentalStatus.BORROWED;
    await this.rentalRepository.create({ bookId, userId: borrowerId, status, comment });

    return { success: true, bookId, userId: borrowerId };
  }
}

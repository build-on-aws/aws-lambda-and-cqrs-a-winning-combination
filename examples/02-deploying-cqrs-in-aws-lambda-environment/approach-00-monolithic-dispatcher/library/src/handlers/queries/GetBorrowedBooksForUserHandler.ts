import { IQueryHandler } from "./IQueryHandler";
import { GetBorrowedBooksForUser } from "../../operations/queries";
import { RentalRepository } from "../../repositories";

export class GetBorrowedBooksForUserHandler implements IQueryHandler<GetBorrowedBooksForUser, { id: string }[]> {
  private readonly rentalRepository;

  constructor(rentalRepository: RentalRepository) {
    this.rentalRepository = rentalRepository;
  }

  handle(operation: GetBorrowedBooksForUser) {
    const rentals = this.rentalRepository.queryByTypeAndSortKey("Rental", operation.userId);
    return rentals.map((rental) => {
      return { id: rental.bookId };
    });
  }
}

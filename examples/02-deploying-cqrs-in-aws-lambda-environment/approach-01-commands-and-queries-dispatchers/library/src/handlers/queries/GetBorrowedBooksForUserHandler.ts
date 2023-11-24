import { IQueryHandler } from "./IQueryHandler";
import { GetBorrowedBooksForUser } from "../../operations/queries";
import { RentalRepository } from "library-system-common/repositories";

export class GetBorrowedBooksForUserHandler implements IQueryHandler<GetBorrowedBooksForUser, { id: string }[]> {
  private readonly rentalRepository;

  constructor(rentalRepository: RentalRepository) {
    this.rentalRepository = rentalRepository;
  }

  async handle(operation: GetBorrowedBooksForUser): Promise<{ id: string }[]> {
    const rentals = await this.rentalRepository.queryByTypeAndSortKey("Rental", operation.userId);
    return rentals.map((rental) => {
      return { id: rental.bookId };
    });
  }
}

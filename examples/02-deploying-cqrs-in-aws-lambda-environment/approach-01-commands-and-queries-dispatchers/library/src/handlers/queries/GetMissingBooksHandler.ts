import { IQueryHandler } from "./IQueryHandler";
import { Book } from "library-system-common/models";
import { BookRepository } from "library-system-common/repositories";
import { GetMissingBooks } from "../../operations/queries";

export class GetMissingBooksHandler implements IQueryHandler<GetMissingBooks, Book[]> {
  private readonly repository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async handle(operation: GetMissingBooks): Promise<Book[]> {
    return await this.repository.queryByTypeAndStatus("Book", operation.status);
  }
}

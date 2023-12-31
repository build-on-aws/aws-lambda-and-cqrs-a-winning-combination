import { IQueryHandler } from "./IQueryHandler";
import { Book } from "../../models/Book";
import { BookRepository } from "../../repositories";
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

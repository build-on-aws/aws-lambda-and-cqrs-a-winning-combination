import { IQueryHandler } from "./IQueryHandler";
import { GetBooksByAuthor } from "../../operations/queries";
import { Book } from "../../models/Book";
import { BookRepository } from "../../repositories";

export class GetBooksByAuthorHandler implements IQueryHandler<GetBooksByAuthor, Book[]> {
  private readonly repository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async handle(operation: GetBooksByAuthor): Promise<Book[]> {
    return this.repository.queryByTypeAndSortKey("Book", operation.authorId);
  }
}

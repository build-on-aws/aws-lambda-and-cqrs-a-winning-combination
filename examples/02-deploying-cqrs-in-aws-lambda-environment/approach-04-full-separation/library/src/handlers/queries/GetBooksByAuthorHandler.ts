import { IQueryHandler } from "./IQueryHandler";
import { GetBooksByAuthor } from "../../operations/queries";
import { Book } from "library-system-common/models";
import { BookRepository } from "library-system-common/repositories";

export class GetBooksByAuthorHandler implements IQueryHandler<GetBooksByAuthor, Book[]> {
  private readonly repository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async handle(operation: GetBooksByAuthor): Promise<Book[]> {
    return this.repository.queryByTypeAndSortKey("Book", operation.authorId);
  }
}

import KSUID from "ksuid";
import { ICommandHandler } from "./ICommandHandler";
import { AddNewBookCommandResponse } from "../../payloads/responses";
import { AddNewBookCommand } from "../../operations/commands";
import { AuthorRepository, BookRepository } from "library-system-common/repositories";
import { Author, BookStatus } from "library-system-common/models";

export class AddNewBookHandler implements ICommandHandler<AddNewBookCommand, AddNewBookCommandResponse> {
  private readonly bookRepository;
  private readonly authorRepository;

  constructor(bookRepository: BookRepository, authorRepository: AuthorRepository) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
  }

  async handle(operation: AddNewBookCommand): Promise<AddNewBookCommandResponse> {
    // Getting an existing author, or creating a new one.
    const author = await this.getOrCreateAuthor(operation.newBookParameters.author);

    // Creating a book.
    const book = await this.bookRepository.create({
      bookId: KSUID.randomSync().string,
      authorId: author.id,
      title: operation.newBookParameters.title,
      isbn: operation.newBookParameters.isbn,
      status: BookStatus.AVAILABLE,
    });

    return { success: true, bookId: book.bookId };
  }

  private async getOrCreateAuthor(author: Author) {
    if (!author.id) {
      return this.authorRepository.create({
        id: KSUID.randomSync().string,
        name: author.name,
        birthdate: author.birthdate,
      });
    } else {
      return this.authorRepository.read({ id: author.id });
    }
  }
}

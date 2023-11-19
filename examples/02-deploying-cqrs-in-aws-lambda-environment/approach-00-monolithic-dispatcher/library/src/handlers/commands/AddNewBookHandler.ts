import KSUID from "ksuid";
import { ICommandHandler } from "./ICommandHandler";
import { AddNewBookCommandResponse } from "../../responses";
import { AddNewBookCommand } from "../../operations/commands";
import { AuthorRepository, BookRepository } from "../../repositories";
import { Author } from "../../models/Author";
import { BookStatus } from "../../models/Book";

export class AddNewBookHandler implements ICommandHandler<AddNewBookCommand, AddNewBookCommandResponse> {
  private readonly bookRepository;
  private readonly authorRepository;

  constructor(bookRepository: BookRepository, authorRepository: AuthorRepository) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
  }

  handle(operation: AddNewBookCommand): AddNewBookCommandResponse {
    const author = this.getOrCreateAuthor(operation.book.author);

    const book = this.bookRepository.create({
      bookId: KSUID.randomSync().string,
      authorId: author.id,
      title: operation.book.title,
      isbn: operation.book.isbn,
      status: BookStatus.AVAILABLE,
    });

    return { success: true, bookId: book.bookId };
  }

  private getOrCreateAuthor(author: Author) {
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

# A Winning Combination: AWS Lambda and CQRS

## Context

## Scenario

- *Use Case*: Library.
  - Why do we refactor to CQRS from CRUD?
    - Maintainability.
      - Readability.
      - Being closer to the domain.
    - Usability.
      - Developer Experience.
        - Lower cognitive load.
      - CRUD vs. Task-based UI.
  - Entities:
    - `Book` (ID, ISBN, Title, Author, Borrower, Status)
    - `Author` (ID, Name and Surname)
    - `User` (ID, Email, Name and Surname, Status)
  - Operations:
    - Queries:
      - `GetBooksByAuthor`
      - `GetBorrowedBooksByUser`
      - `GetMissingBooks`
    - Commands:
      - `AddNewBook`.
        - Checking if author exists.
          - If not, adding author.
        - Adding book with that author, no borrower, and certain status.
      - `BorrowBook`
        - Checking if book is available.
          - If not, returning error.
        - Updating borrower.
        - Updating book status.
      - `ReportMissingBook`
        - Update book status.
        - Mark user that borrowed as wrongly behaving.
        - Remove current borrower from the book.

## TODO

- [ ] Screenplay.
- [ ] List of assets for the chalk-talk.
- [ ] Adding `aws-sam-cli` and `awscli` to the `.tool-versions`.

## Resources

- [Command-Query Separation](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)
- [Martin Fowler on CQS](https://martinfowler.com/bliki/CommandQuerySeparation.html)
- [Greg Young on CQRS](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf)
- [Martin Fowler on CQRS](https://martinfowler.com/bliki/CQRS.html)
- [Oskar Dudycz on CQRS and Event Sourcing](https://event-driven.io/en/event_streaming_is_not_event_sourcing/)
- [Oskar Dudycz on CQRS Myths](https://event-driven.io/en/cqrs_facts_and_myths_explained/)
- [Oskar Dudycz CRUD to CQRS Example in .NET](https://github.com/oskardudycz/EventSourcing.NetCore/tree/main/Sample/CRUDToCQRS)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the *MIT-0* License. See the [LICENSE](LICENSE) file.

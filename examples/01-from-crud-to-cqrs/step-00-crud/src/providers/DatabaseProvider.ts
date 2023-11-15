import { Dynamode } from "dynamode";
import { DI } from "../server";
import { LibraryTable } from "../model/base/LibraryTable";
import { Author } from "../model/Author";
import { Book } from "../model/Book";
import { Rental } from "../model/Rental";
import { User } from "../model/User";

export class DatabaseProvider {
  public readonly name: string;
  public readonly localDynamoDB: boolean;

  private readonly manager;

  public readonly authors;
  public readonly books;
  public readonly rentals;
  public readonly users;

  constructor(providedTableName: string | null) {
    this.localDynamoDB = !providedTableName;
    this.name = providedTableName || LibraryTable.getDefaultTableName();

    if (this.localDynamoDB) {
      // WARNING: Do not replace `127.0.0.1` to `localhost`.
      //
      // Since the version 17+, DNS subsystem in Node.js will now resolve to the 1st IP address returned by your
      // DNS resolver, instead of always favouring IPv4 addresses. It results by providing `::1` which is not
      // compatible with Docker-like environments, and results in ECONNREFUSED.
      //
      //   Source: https://github.com/aws/aws-sdk-js-v3/issues/4294#issuecomment-1541191147
      //
      Dynamode.ddb.local('http://127.0.0.1:8000');

      DI.logger.info(`🔨 Using local DynamoDB listening at port 8000 with default '${this.name}' table name.`);
    } else {
      DI.logger.info(`🌍 Using DynamoDB service with provided '${this.name}' table name.`);
    }

    this.manager = LibraryTable.getTableManager();

    this.authors = this.manager.entityManager(Author);
    this.books = this.manager.entityManager(Book);
    this.rentals = this.manager.entityManager(Rental);
    this.users = this.manager.entityManager(User);
  }

  async createEnvironment() {
    if (this.localDynamoDB) {
      await LibraryTable.create();
    }
  }

  async destroyEnvironment() {
    if (this.localDynamoDB) {
      await LibraryTable.delete();
    }
  }
}

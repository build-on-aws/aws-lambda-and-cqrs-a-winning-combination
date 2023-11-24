import { QueriesDispatcherContext } from "library-system-common/common/lambda-adapter";
import { IDatabaseProvider } from "library-system-common/database/IDatabaseProvider";
import { RepositoriesFactory } from "../factories/RepositoriesFactory";
import { QueryHandlersFactory } from "../factories/QueryHandlersFactory";

export class QueriesDispatcher {
  private readonly context: QueriesDispatcherContext;
  private readonly repositoriesFactory: RepositoriesFactory;

  protected constructor(context: QueriesDispatcherContext, databaseProvider: IDatabaseProvider) {
    this.context = context;
    this.repositoriesFactory = new RepositoriesFactory(databaseProvider);
  }

  static create(context: QueriesDispatcherContext, databaseProvider: IDatabaseProvider) {
    return new QueriesDispatcher(context, databaseProvider);
  }

  dispatch() {
    return QueryHandlersFactory.createAndHandle(this.context, this.repositoriesFactory);
  }
}

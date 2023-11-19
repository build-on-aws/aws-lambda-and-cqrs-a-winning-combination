import { RepositoriesFactory } from "../factories/RepositoriesFactory";
import { QueryHandlersFactory } from "../factories/QueryHandlersFactory";
import { CommandHandlersFactory } from "../factories/CommandHandlersFactory";

export type DispatcherContext = {
  method: string;
  resource: string;
  queryParameters: { status?: string };
  pathParameters: { bookId?: string; authorId?: string; userId?: string };
  payload?: string;
  requestId: string;
};

export class Dispatcher {
  private readonly context: DispatcherContext;
  private readonly repositoriesFactory: RepositoriesFactory;

  protected constructor(context: DispatcherContext, repositoriesFactory: RepositoriesFactory) {
    this.context = context;
    this.repositoriesFactory = repositoriesFactory;
  }

  static create(context: DispatcherContext, repositoriesFactory: RepositoriesFactory) {
    return new Dispatcher(context, repositoriesFactory);
  }

  dispatch() {
    if (this.context.method === "GET") {
      return QueryHandlersFactory.createAndHandle(this.context, this.repositoriesFactory);
    } else {
      return CommandHandlersFactory.createAndHandle(this.context, this.repositoriesFactory);
    }
  }
}

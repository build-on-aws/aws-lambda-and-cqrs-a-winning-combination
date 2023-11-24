import { CommandsDispatcherContext } from "library-system-common/common/lambda-adapter";
import { IDatabaseProvider } from "library-system-common/database/IDatabaseProvider";
import { RepositoriesFactory } from "../factories/RepositoriesFactory";
import { CommandHandlersFactory } from "../factories/CommandHandlersFactory";

export class CommandsDispatcher {
  private readonly context: CommandsDispatcherContext;
  private readonly repositoriesFactory: RepositoriesFactory;

  protected constructor(context: CommandsDispatcherContext, databaseProvider: IDatabaseProvider) {
    this.context = context;
    this.repositoriesFactory = new RepositoriesFactory(databaseProvider);
  }

  static create(context: CommandsDispatcherContext, databaseProvider: IDatabaseProvider) {
    return new CommandsDispatcher(context, databaseProvider);
  }

  dispatch() {
    return CommandHandlersFactory.createAndHandle(this.context, this.repositoriesFactory);
  }
}

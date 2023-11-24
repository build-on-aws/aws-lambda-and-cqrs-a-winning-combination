import { PrimaryKey } from "../database/DatabaseEntities";
import { IDatabaseProvider, PaginationParameters } from "../database/IDatabaseProvider";

export abstract class BaseRepository<TModel, TModelForUpdate, TKey> {
  protected readonly databaseProvider: IDatabaseProvider;

  protected constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  abstract create(model: TModel): Promise<TModel>;
  abstract read(primaryKey: TKey): Promise<TModel>;
  abstract update(primaryKey: TKey, model: TModelForUpdate): Promise<TModel>;
  abstract delete(primaryKey: TKey): Promise<TKey>;

  abstract queryByTypeAndSortKey(name: string, sortKey: string, pagination?: PaginationParameters): Promise<TModel[]>;
  abstract queryByTypeAndStatus(name: string, status: string, pagination?: PaginationParameters): Promise<TModel[]>;

  protected abstract getFormattedKey(primaryKey: TKey): PrimaryKey;
}

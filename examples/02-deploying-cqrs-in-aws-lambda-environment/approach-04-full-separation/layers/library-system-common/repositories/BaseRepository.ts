import { PrimaryKey } from "../database/DatabaseEntities";
import { IDatabaseProvider } from "../database/IDatabaseProvider";

export abstract class BaseRepository<TModel, TModelForUpdate, TKey> {
  protected readonly databaseProvider: IDatabaseProvider;

  protected constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  abstract create(model: TModel): Promise<TModel>;
  abstract read(primaryKey: TKey): Promise<TModel>;
  abstract update(primaryKey: TKey, model: TModelForUpdate): Promise<TModel>;
  abstract delete(primaryKey: TKey): Promise<TKey>;

  abstract queryByTypeAndSortKey(entityName: string, sortKey: string): Promise<TModel[]>;
  abstract queryByTypeAndStatus(entityName: string, status: string): Promise<TModel[]>;

  protected abstract getFormattedKey(primaryKey: TKey): PrimaryKey;
}

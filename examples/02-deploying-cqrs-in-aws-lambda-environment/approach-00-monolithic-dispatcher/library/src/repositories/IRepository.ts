export interface IRepository<TModel, TModelForUpdate, TKey> {
  create(model: TModel): TModel;
  read(primaryKey: TKey): TModel;
  update(primaryKey: TKey, model: TModelForUpdate): TModel;
  delete(primaryKey: TKey): TKey;

  queryByTypeAndSortKey(entityName: string, sortKey: string): TModel[];
  queryByTypeAndStatus(entityName: string, status: string): TModel[];
}

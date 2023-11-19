import { IRepository } from "../../repositories";

export interface IRepositoryFactory<TModel, TModelForUpdate, TKey> {
  createRepositoryFor(entityName: string): IRepository<TModel, TModelForUpdate, TKey>;
}

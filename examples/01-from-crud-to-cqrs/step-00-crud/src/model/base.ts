import { FieldsToUpdate } from "../database/DatabaseActionsProvider";

export type PrimaryKey = {
  resourceId: string;
  subResourceId: string;
};

export type BaseModel = PrimaryKey & {
  type: string;
  createdAt?: string;
  updatedAt?: string;
};

export type EmptyMapping = {
  id: string;
};

export interface IMapper<P, M, E = EmptyMapping> {
  toKey(): PrimaryKey;
  emptyMapping(): E;
  toMapping(): P;
  toModel(): M;
  toUpdate(): FieldsToUpdate;
}

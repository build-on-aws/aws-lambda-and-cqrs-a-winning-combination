import { BaseDatabaseMapping, PrimaryKey } from "./DatabaseEntities";
import { Index } from "./DatabaseProvider";

export enum QueryOperator {
  EQ = "=",
}

export type Pair = {
  name: string;
  value: string;
};

export type FieldsToUpdate = Pair[];

export type QueryTriple = Pair & {
  operator: QueryOperator;
};

export type MarshalledPrimaryKey = {
  resourceId: { S: string };
  subResourceId: { S: string };
};

export type PaginationParameters = {
  ExclusiveStartKey?: MarshalledPrimaryKey;
  Limit: number;
  ScanIndexForward: boolean;
};

export interface IDatabaseProvider {
  put(item: BaseDatabaseMapping): Promise<BaseDatabaseMapping>;
  get(key: PrimaryKey): Promise<Record<string, any>>;
  update(key: PrimaryKey, update: FieldsToUpdate): Promise<Record<string, any>>;
  delete(key: PrimaryKey): Promise<PrimaryKey | null>;
  query(parameters: QueryTriple[], index?: Index, pagination?: PaginationParameters): Promise<Record<string, any>[]>;
}

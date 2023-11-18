import moment from "moment";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { LibrarySystemDatabase } from "./LibrarySystemDatabase";
import { BaseModel, PrimaryKey } from "../common/model";
import { NoFieldsToUpdate } from "../exceptions/NoFieldsToUpdate";

type MarshalledPrimaryKey = {
  resourceId: { S: string };
  subResourceId: { S: string };
};

export type PaginationParameters = {
  ExclusiveStartKey?: MarshalledPrimaryKey;
  Limit: number;
  ScanIndexForward: boolean;
};

enum QueryOperator {
  EQ = "=",
}

type Pair = {
  name: string;
  value: string;
};

export type FieldsToUpdate = Pair[];

type QueryTriple = Pair & {
  operator: QueryOperator;
};

type Dict = Record<string, string>;

export enum Index {
  TYPE = "TYPE",
  STATUS = "STATUS",
}

export const ByType = (typeValue: string): QueryTriple[] => {
  return [{ name: "type", operator: QueryOperator.EQ, value: typeValue }];
};

export const ByTypeAndSortKey = (typeValue: string, sortKeyValue: string): QueryTriple[] => {
  return ByType(typeValue).concat({ name: "subResourceId", operator: QueryOperator.EQ, value: sortKeyValue });
};

export const ByTypeAndStatus = (typeValue: string, statusValue: string): QueryTriple[] => {
  return ByType(typeValue).concat({ name: "status", operator: QueryOperator.EQ, value: statusValue });
};

export class DatabaseActionsProvider {
  private readonly client;
  private readonly table;

  constructor(client: DynamoDBDocument, table: LibrarySystemDatabase) {
    this.client = client;
    this.table = table;
  }

  async put(item: BaseModel) {
    item.createdAt = moment().toISOString();

    try {
      await this.client.put({
        TableName: this.table.getTableName(),
        Item: item,
      });

      return item;
    } catch (error: any) {
      return null;
    }
  }

  async query(parameters: QueryTriple[], index?: Index, pagination?: PaginationParameters) {
    const { expression, names, values } = this.prepareQuery(parameters);

    const result = await this.client.query({
      TableName: this.table.getTableName(),
      KeyConditionExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      IndexName: this.assignIndex(index),
      ...pagination,
    });

    return result.Items ?? [];
  }

  async get(key: PrimaryKey) {
    const result = await this.client.get({
      TableName: this.table.getTableName(),
      Key: key,
    });

    return result.Item;
  }

  async update(key: PrimaryKey, update: FieldsToUpdate) {
    if (Object.keys(update).length === 0) {
      throw new NoFieldsToUpdate("No Fields To Update");
    }

    const { names, values } = this.prepareNamesAndValues(update);

    if (Object.keys(update).length > 0) {
      names["#uts"] = "updatedAt";
      values[":uts"] = moment().toISOString();
    }

    const attributeNames = Object.keys(names);
    const attributeValues = Object.keys(values);

    const updateExpression = attributeNames
      .map((name, i) => [name, attributeValues[i]])
      .map((pair) => pair.join(" = "))
      .join(", ");

    try {
      const result = await this.client.update({
        TableName: this.table.getTableName(),
        Key: key,
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",
        ConditionExpression: "attribute_exists(resourceId) AND attribute_exists(subResourceId)",
      });

      return result.Attributes;
    } catch (error: any) {
      return null;
    }
  }

  async delete(key: PrimaryKey) {
    try {
      await this.client.delete({
        TableName: this.table.getTableName(),
        Key: key,
        Expected: {
          resourceId: {
            Value: key.resourceId,
            Exists: true,
          },
        },
      });
    } catch (error: any) {
      return null;
    }

    return key;
  }

  private prepareNamesAndValues(parameters: FieldsToUpdate): { names: Dict; values: Dict } {
    const [names, values] = parameters.reduce(
      (acc, parameter, i) => {
        return [
          { ...acc[0], [`#_${i}`]: parameter.name },
          { ...acc[1], [`:_${i}`]: parameter.value },
        ];
      },
      [{}, {}],
    );

    return { names, values };
  }

  private prepareQuery(parameters: QueryTriple[]) {
    const { names, values } = this.prepareNamesAndValues(parameters);

    const attributeNames = Object.keys(names);
    const attributeValues = Object.keys(values);

    const expression = attributeNames
      .map((name, i) => [name, parameters[i].operator, attributeValues[i]])
      .map((triples) => triples.join(" "))
      .join(" AND ");

    return { expression, names, values };
  }

  private assignIndex(index?: Index) {
    switch (index) {
      case Index.TYPE:
        return this.table.getEntityTypeIndexName();

      case Index.STATUS:
        return this.table.getEntityStatusIndexName();

      default:
        return undefined;
    }
  }
}

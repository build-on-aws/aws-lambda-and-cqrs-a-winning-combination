import moment from "moment";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { LibrarySystemDatabase } from "./LibrarySystemDatabase";
import { BaseModel, PrimaryKey } from "../model/base";

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

export const ByType = (typeValue: string): QueryTriple[] => {
  return [{ name: "type", operator: QueryOperator.EQ, value: typeValue }];
};

export const ByTypeAndSortKey = (typeValue: string, sortKeyValue: string): QueryTriple[] => {
  return ByType(typeValue).concat({ name: "subResourceId", operator: QueryOperator.EQ, value: sortKeyValue });
};

export class DatabaseActionsProvider {
  private readonly client;
  private readonly table;

  constructor(client: DynamoDBDocument, table: LibrarySystemDatabase) {
    this.client = client;
    this.table = table;
  }

  // TODO: WRAP SDK RESPONSES IN NICE OBJECTS AND ADD ERROR HANDLING

  async put(item: BaseModel) {
    item.createdAt = moment().toISOString();

    const result = await this.client.put({
      TableName: this.table.getTableName(),
      Item: item,
    });

    if (result.$metadata.httpStatusCode !== 200) {
      return null;
    } else {
      return item;
    }
  }

  async queryWithIndex(parameters: QueryTriple[], pagination: PaginationParameters) {
    const { expression, names, values } = this.prepareQuery(parameters);

    const result = await this.client.query({
      TableName: this.table.getTableName(),
      KeyConditionExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      IndexName: this.table.getTypeIndexName(),
      ...pagination,
    });

    return result.Items;
  }

  async get(key: PrimaryKey) {
    const result = await this.client.get({
      TableName: this.table.getTableName(),
      Key: key,
    });

    return result.Item;
  }

  async update(key: PrimaryKey, update: FieldsToUpdate) {
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

    const result = await this.client.update({
      TableName: this.table.getTableName(),
      Key: key,
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
    });

    return result.Attributes;
  }

  async delete(key: PrimaryKey) {
    const result = await this.client.delete({
      TableName: this.table.getTableName(),
      Key: key,
    });

    if (result.$metadata.httpStatusCode !== 200) {
      return null;
    } else {
      return key;
    }
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
}

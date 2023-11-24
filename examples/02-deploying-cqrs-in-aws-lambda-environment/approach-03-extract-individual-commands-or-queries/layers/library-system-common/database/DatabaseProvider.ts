import moment from "moment/moment";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, TranslateConfig } from "@aws-sdk/lib-dynamodb";
import { EntityNotFound } from "../exceptions/EntityNotFound";
import { NoFieldsToUpdate } from "../exceptions/NoFieldsToUpdate";
import { BaseDatabaseMapping, PrimaryKey } from "./DatabaseEntities";
import { FieldsToUpdate, PaginationParameters, QueryOperator, QueryTriple } from "./IDatabaseProvider";
import { IDatabaseProvider } from "./IDatabaseProvider";

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

export type DatabaseDetails = {
  tableName: string;
  entityTypeIndexName: string;
  entityStatusIndexName: string;
};

export class DatabaseProvider implements IDatabaseProvider {
  private readonly client: DynamoDBDocument;

  private readonly tableName: string;
  private readonly entityTypeIndexName: string;
  private readonly entityStatusIndexName: string;

  constructor(databaseDetails: DatabaseDetails) {
    const clientConfig: DynamoDBClientConfig = {};
    const translateConfig: TranslateConfig = {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    };

    this.tableName = databaseDetails.tableName;
    this.entityTypeIndexName = databaseDetails.entityTypeIndexName;
    this.entityStatusIndexName = databaseDetails.entityTypeIndexName;

    this.client = DynamoDBDocument.from(new DynamoDBClient(clientConfig), translateConfig);
  }

  async put(item: BaseDatabaseMapping) {
    await this.client.put({
      TableName: this.tableName,
      Item: item,
    });

    return item;
  }

  async get(key: PrimaryKey) {
    const result = await this.client.get({
      TableName: this.tableName,
      Key: key,
    });

    if (!result.Item) {
      throw new EntityNotFound(`Entity with primary key '${key.resourceId}, ${key.subResourceId}' not found`);
    }

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

    const result = await this.client.update({
      TableName: this.tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(resourceId) AND attribute_exists(subResourceId)",
    });

    if (!result.Attributes) {
      throw new EntityNotFound(`Entity with primary key '${key.resourceId}, ${key.subResourceId}' not found`);
    }

    return result.Attributes;
  }

  async delete(key: PrimaryKey) {
    try {
      await this.client.delete({
        TableName: this.tableName,
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

  async query(parameters: QueryTriple[], index?: Index, pagination?: PaginationParameters) {
    const { expression, names, values } = this.prepareQuery(parameters);

    const result = await this.client.query({
      TableName: this.tableName,
      KeyConditionExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      IndexName: this.assignIndex(index),
      ...pagination,
    });

    return result.Items ?? [];
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
        return this.entityTypeIndexName;

      case Index.STATUS:
        return this.entityStatusIndexName;

      default:
        return undefined;
    }
  }
}

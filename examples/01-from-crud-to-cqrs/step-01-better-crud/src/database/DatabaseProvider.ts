import moment from "moment/moment";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, TranslateConfig } from "@aws-sdk/lib-dynamodb";
import { NotFoundError } from "../exceptions/NotFoundError";
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
  if (!sortKeyValue) {
    return ByType(typeValue);
  }

  return ByType(typeValue).concat({ name: "subResourceId", operator: QueryOperator.EQ, value: sortKeyValue });
};

export const ByTypeAndStatus = (typeValue: string, statusValue: string): QueryTriple[] => {
  if (!statusValue) {
    return ByType(typeValue);
  }

  return ByType(typeValue).concat({ name: "status", operator: QueryOperator.EQ, value: statusValue });
};

const TABLE_NAME: string = "library-system-database";
const ENTITY_TYPE_INDEX: string = "GSI1";
const ENTITY_STATUS_INDEX: string = "GSI2";

export type DatabaseDetails = {
  tableName?: string;
  entityTypeIndexName?: string;
  entityStatusIndexName?: string;
};

export class DatabaseProvider implements IDatabaseProvider {
  private readonly logger: Console;
  private readonly localDynamoDB: boolean;

  private readonly client: DynamoDBDocument;

  private readonly tableName: string;
  private readonly entityTypeIndexName: string;
  private readonly entityStatusIndexName: string;

  constructor(databaseDetails: DatabaseDetails, logger: Console) {
    const clientConfig: DynamoDBClientConfig = {};
    const translateConfig: TranslateConfig = {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    };

    this.localDynamoDB = !databaseDetails.tableName;
    this.logger = logger;

    if (this.localDynamoDB) {
      // WARNING: Do not replace `127.0.0.1` to `localhost`.
      //
      // Since the version 17+, DNS subsystem in Node.js will now resolve to the 1st IP address returned by your
      // DNS resolver, instead of always favouring IPv4 addresses. It results by providing `::1` which is not
      // compatible with Docker-like environments, and results in ECONNREFUSED.
      //
      //   Source: https://github.com/aws/aws-sdk-js-v3/issues/4294#issuecomment-1541191147
      //
      clientConfig.region = "local";
      clientConfig.endpoint = "http://127.0.0.1:8000";
      clientConfig.credentials = {
        accessKeyId: "local",
        secretAccessKey: "local",
      };

      logger.info(`🔨 Using local Amazon DynamoDB via HTTP listening at port 8000.`);
    } else {
      logger.info(`🌍 Using remote Amazon DynamoDB via HTTPS.`);
    }

    this.tableName = databaseDetails.tableName ?? TABLE_NAME;
    this.entityTypeIndexName = databaseDetails.entityTypeIndexName ?? ENTITY_TYPE_INDEX;
    this.entityStatusIndexName = databaseDetails.entityTypeIndexName ?? ENTITY_STATUS_INDEX;

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
      throw new NotFoundError(`Entity with primary key '${key.resourceId}, ${key.subResourceId}' not found`);
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

    try {
      const result = await this.client.update({
        TableName: this.tableName,
        Key: key,
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",
        ConditionExpression: "attribute_exists(resourceId) AND attribute_exists(subResourceId)",
      });

      return result.Attributes ?? {};
    } catch (error: any) {
      throw new NotFoundError(`Entity with primary key '${key.resourceId}, ${key.subResourceId}' not found`);
    }
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
      throw new NotFoundError(`Entity with primary key '${key.resourceId}, ${key.subResourceId}' not found`);
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

  async createTable(): Promise<void> {
    if (this.localDynamoDB) {
      const command = new CreateTableCommand({
        TableName: this.tableName,
        KeySchema: [
          { AttributeName: "resourceId", KeyType: "HASH" },
          { AttributeName: "subResourceId", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "resourceId", AttributeType: "S" },
          { AttributeName: "subResourceId", AttributeType: "S" },
          { AttributeName: "type", AttributeType: "S" },
          { AttributeName: "status", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: this.entityTypeIndexName,
            KeySchema: [
              { AttributeName: "type", KeyType: "HASH" },
              { AttributeName: "subResourceId", KeyType: "RANGE" },
            ],
            Projection: {
              ProjectionType: "ALL",
            },
          },
          {
            IndexName: this.entityStatusIndexName,
            KeySchema: [
              { AttributeName: "type", KeyType: "HASH" },
              { AttributeName: "status", KeyType: "RANGE" },
            ],
            Projection: {
              ProjectionType: "ALL",
            },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });
      const result = await this.client.send(command);

      if (result.$metadata.httpStatusCode === 200 && result.TableDescription) {
        this.logger.debug(`⬆️ Amazon DynamoDB table created: ${result.TableDescription.TableArn}`);
      }
    }
  }

  async destroyTable(): Promise<void> {
    if (this.localDynamoDB) {
      const command = new DeleteTableCommand({ TableName: this.tableName });
      const result = await this.client.send(command);

      if (result.$metadata.httpStatusCode === 200 && result.TableDescription) {
        this.logger.debug(`⬇️ Amazon DynamoDB table destroyed: ${result.TableDescription.TableArn}`);
      }
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

import { CreateTableCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";
import { DeleteTableCommand, DeleteTableCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME: string = "library-system-database";
const INDEX_NAME: string = "GSI1";

const CREATE_TABLE_COMMAND: CreateTableCommandInput = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: "resourceId", KeyType: "HASH" },
    { AttributeName: "subResourceId", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "resourceId", AttributeType: "S" },
    { AttributeName: "subResourceId", AttributeType: "S" },
    { AttributeName: "type", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: INDEX_NAME,
      KeySchema: [
        { AttributeName: "type", KeyType: "HASH" },
        { AttributeName: "subResourceId", KeyType: "RANGE" },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
};

const DELETE_TABLE_COMMAND: DeleteTableCommandInput = {
  TableName: TABLE_NAME,
};

export class LibrarySystemDatabase {
  private readonly client;
  private readonly logger;

  private readonly tableName;
  private readonly typeIndexName;

  constructor(client: DynamoDBDocument, logger: Console) {
    this.client = client;
    this.logger = logger;

    this.tableName = TABLE_NAME;
    this.typeIndexName = INDEX_NAME;
  }

  getTableName(): string {
    return this.tableName;
  }

  getTypeIndexName(): string {
    return this.typeIndexName;
  }

  async createTable() {
    const command = new CreateTableCommand(CREATE_TABLE_COMMAND);
    const result = await this.client.send(command);

    if (result.$metadata.httpStatusCode === 200 && result.TableDescription) {
      this.logger.debug(`⬆️ Amazon DynamoDB table created: ${result.TableDescription.TableArn}`);
    }
  }

  async destroyTable() {
    const command = new DeleteTableCommand(DELETE_TABLE_COMMAND);
    const result = await this.client.send(command);

    if (result.$metadata.httpStatusCode === 200 && result.TableDescription) {
      this.logger.debug(`⬇️ Amazon DynamoDB table destroyed: ${result.TableDescription.TableArn}`);
    }
  }
}

import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, TranslateConfig } from "@aws-sdk/lib-dynamodb";
import { LibrarySystemDatabase } from "./LibrarySystemDatabase";
import { DatabaseActionsProvider } from "./DatabaseActionsProvider";

export class DatabaseProvider {
  private readonly localDynamoDB: boolean;
  private readonly client: DynamoDBDocument;
  private readonly table: LibrarySystemDatabase;

  public readonly actions: DatabaseActionsProvider;

  constructor(providedTableName: string | null, logger: Console) {
    this.localDynamoDB = !providedTableName;

    const clientConfig: DynamoDBClientConfig = {};

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

    const translateConfig: TranslateConfig = {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    };

    this.client = DynamoDBDocument.from(new DynamoDBClient(clientConfig), translateConfig);
    this.table = new LibrarySystemDatabase(this.client, logger);
    this.actions = new DatabaseActionsProvider(this.client, this.table);
  }

  async createEnvironment() {
    if (this.localDynamoDB) {
      await this.table.createTable();
    }
  }

  async destroyEnvironment() {
    if (this.localDynamoDB) {
      await this.table.destroyTable();
    }
  }
}

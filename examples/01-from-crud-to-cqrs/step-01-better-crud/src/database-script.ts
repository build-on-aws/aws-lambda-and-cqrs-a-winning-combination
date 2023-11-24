import { DatabaseProvider } from "./database/DatabaseProvider";

const tableName = process.env.DYNAMODB_TABLE_NAME || null;
const entityTypeIndexName = process.env.DYNAMODB_ENTITY_TYPE_INDEX_NAME || null;
const entityStatusIndexName = process.env.DYNAMODB_ENTITY_STATUS_INDEX_NAME || null;

const command = process.argv[2] || "";

let exitCode = 0;

(async () => {
  const database = new DatabaseProvider({ tableName, entityTypeIndexName, entityStatusIndexName }, console);

  switch (command) {
    case "destroy-database":
      console.info("⏳  DESTROYING database environment ...");

      try {
        await database.destroyTable();
      } catch (error: any) {
        if (error.name !== "ResourceNotFoundException") {
          throw error;
        } else {
          console.info("🟠 Database environment was already destroyed.");
        }
      } finally {
        console.info("🔴 Operation completed.");
      }
      break;

    case "create-database":
      console.info("⏳  CREATING database environment ...");

      try {
        await database.createTable();
      } catch (error: any) {
        if (error.name !== "ResourceInUseException") {
          throw error;
        } else {
          console.info("🟠 Database environment was already created.");
        }
      } finally {
        console.info("🟢 Operation completed.");
      }
      break;

    default:
      console.error(`⚠️ Unrecognized command provided: '${command}'`);
      exitCode = 1;
      break;
  }

  process.exit(exitCode);
})();

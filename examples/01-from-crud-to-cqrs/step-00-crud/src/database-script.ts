import { DatabaseProvider } from "./providers/DatabaseProvider";

const providedTableName = process.env.DYNAMODB_TABLE_NAME || null;
const command = process.argv[2] || "";

let exitCode = 0;

(async () => {
  const database = new DatabaseProvider(providedTableName, console);

  switch(command) {
    case 'destroy-database':
      console.info('⏳  DESTROYING database environment ...');

      try {
        await database.destroyEnvironment();
      } catch (error: any) {
        if (error.name !== 'ResourceNotFoundException') {
          throw error;
        } else {
          console.info('🟠 Database environment was already destroyed.');
        }
      } finally {
        console.info('🔴 Operation completed.');
      }
      break;

    case 'create-database':
      console.info('⏳  CREATING database environment ...');

      try {
        await database.createEnvironment();
      } catch (error: any) {
        if (error.name !== 'ResourceInUseException') {
          throw error;
        } else {
          console.info('🟠 Database environment was already created.');
        }
      } finally {
        console.info('🟢 Operation completed.');
      }
      break;

    default:
      console.error(`⚠️ Unrecognized command provided: '${command}'`);
      exitCode = 1;
      break;
  }

  process.exit(exitCode)
})();

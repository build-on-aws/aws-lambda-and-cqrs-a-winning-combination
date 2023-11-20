import { IDatabaseProvider } from "../../src/database/IDatabaseProvider";
import { BaseDatabaseMapping, PrimaryKey } from "../../src/database/DatabaseEntities";

export class DummyDatabaseProvider implements IDatabaseProvider {
  put(): Promise<BaseDatabaseMapping> {
    return Promise.resolve({ resourceId: "", subResourceId: "", type: "" });
  }

  get(): Promise<Record<string, any>> {
    return Promise.resolve({});
  }

  update(): Promise<Record<string, any>> {
    return Promise.resolve({});
  }

  delete(): Promise<PrimaryKey | null> {
    return Promise.resolve({ resourceId: "", subResourceId: "" });
  }

  query(): Promise<Record<string, any>[]> {
    return Promise.resolve([]);
  }
}

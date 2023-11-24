import { IDatabaseProvider, QueryTriple } from "library-system-common/database/IDatabaseProvider";
import { BaseDatabaseMapping, PrimaryKey } from "library-system-common/database/DatabaseEntities";
import { RentalStatus } from "library-system-common/models";

export class EmptyDatabaseProvider implements IDatabaseProvider {
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

  query(parameters: QueryTriple[]): Promise<Record<string, any>[]> {
    if (parameters[0].name === "type" && parameters[0].value === "Rental") {
      if (parameters[1].name === "status" && parameters[1].value === RentalStatus.BORROWED) {
        return Promise.resolve([
          {
            resourceId: "Book#2Yd7vFcSkFQDzu1LSDybhCXV1wi",
            subResourceId: "User#2Yd89Ain8o95ISdO9xxYK1xxLUO",
            type: "Rental",
          },
        ]);
      }
    }

    return Promise.resolve([]);
  }
}

import attribute from 'dynamode/decorators';
import Entity from 'dynamode/entity';
import { TableManager } from "dynamode";

const TABLE_NAME: string = 'library-system-database';
const GSI1_INDEX: string = 'entity-type';
const GSI2_INDEX: string = 'status-type';

export type LibraryTablePrimaryKey = {
  resourceId: string;
  subResourceId: string;
};

export type LibraryTableProps = LibraryTablePrimaryKey & {
  createdAt?: Date;
  updatedAt?: Date;
};

export class LibraryTable extends Entity {
  @attribute.partitionKey.string()
  resourceId: string;

  @attribute.sortKey.string()
  subResourceId: string;

  @attribute.gsi.partitionKey.string({ indexName: GSI1_INDEX })
  type: string;

  @attribute.gsi.sortKey.string({ indexName: GSI1_INDEX })
  subType: string;

  @attribute.gsi.partitionKey.string({ indexName: GSI2_INDEX })
  statusType: string;

  @attribute.gsi.sortKey.string({ indexName: GSI2_INDEX })
  statusSubType: string

  @attribute.date.string()
  createdAt: Date;

  @attribute.date.string()
  updatedAt: Date;

  constructor(props: LibraryTableProps) {
    super(props);

    this.resourceId = props.resourceId;
    this.subResourceId = props.subResourceId;

    this.type = this.dynamodeEntity;
    this.statusType = this.dynamodeEntity;

    // We could overload the primary sort key for the purpose of the GSI, but ...
    // Dynamode does not support multiple attribute annotations so far.
    // That's why we will clone `subResourceId` to `subType` and `statusSubType` in the constructor.
    this.subType = this.subResourceId;
    this.statusSubType = this.subResourceId;

    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static manager: any;

  static getDefaultTableName() {
    return TABLE_NAME;
  }

  static getTableManager() {
    if (!LibraryTable.manager) {
      LibraryTable.manager = new TableManager(LibraryTable, {
        tableName: TABLE_NAME,
        partitionKey: 'resourceId',
        sortKey: 'subResourceId',
        indexes: {
          [GSI1_INDEX]: {
            partitionKey: 'type',
            sortKey: 'subType',
          }
        },
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      });
    }

    return LibraryTable.manager;
  }

  static async create() {
    await LibraryTable.manager.createTable();
  }

  static async destroy() {
    await LibraryTable.manager.deleteTable(TABLE_NAME);
  }
}

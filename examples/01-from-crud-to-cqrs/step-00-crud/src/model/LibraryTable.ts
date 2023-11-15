import attribute from 'dynamode/decorators';
import Entity from 'dynamode/entity';
import { TableManager } from "dynamode";
import { Metadata } from "dynamode/table/types";

const TABLE_NAME: string = 'library-system-database';
const GSI1_INDEX: string = 'entity-type';

export type LibraryTablePrimaryKey = {
  pk: string;
  sk: string;
};

export type LibraryTableProps = LibraryTablePrimaryKey & {
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class LibraryTable extends Entity {
  @attribute.partitionKey.string()
  pk: string;

  @attribute.sortKey.string()
  sk: string;

  @attribute.gsi.partitionKey.string({ indexName: GSI1_INDEX })
  type!: string;

  @attribute.gsi.sortKey.string({ indexName: GSI1_INDEX })
  sk2!: string

  @attribute.date.string()
  createdAt: Date;

  @attribute.date.string()
  updatedAt: Date;

  constructor(props: LibraryTableProps) {
    super(props);

    this.pk = props.pk;
    this.sk = props.sk;

    this.type = props.type || "";
    this.sk2 = this.sk;

    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static manager: TableManager<Metadata<typeof LibraryTable>, typeof LibraryTable>;

  static getDefaultTableName() {
    return TABLE_NAME;
  }

  static getTableManager() {
    if (!LibraryTable.manager) {
      LibraryTable.manager = new TableManager(LibraryTable, {
        tableName: TABLE_NAME,
        partitionKey: 'pk',
        sortKey: 'sk',
        indexes: {
          [GSI1_INDEX]: {
            partitionKey: 'type',
            sortKey: 'sk2',
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

  static async delete() {
    await LibraryTable.manager.deleteTable(TABLE_NAME);
  }
}

export type PrimaryKey = {
  resourceId: string;
  subResourceId: string;
};

export type BaseDatabaseMapping = PrimaryKey & {
  type: string;
  createdAt?: string;
  updatedAt?: string;
};

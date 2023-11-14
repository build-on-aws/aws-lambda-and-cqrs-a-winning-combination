export abstract class BaseEntity {
  id!: number;
  createdAt = new Date();
  updatedAt = new Date();
}

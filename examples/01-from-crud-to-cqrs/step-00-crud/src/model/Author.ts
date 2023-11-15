import { Book } from './Book';
import { BaseEntity } from './BaseEntity';

export class Author extends BaseEntity {
  name: string;

  books?: [Book];

  constructor(name: string) {
    super();
    this.name = name;
  }
}

import { BaseMapping } from './base/BaseMapping';
import { MappingValidationError } from './exceptions/MappingValidationError';
import { Book } from '../model/Book';

type BookMappingAllowedFields = {
  id?: string;
  authorId: string;
  title: string;
  isbn: string;
  status?: string;
}

export class BookMapping extends BaseMapping {
  public readonly authorId: string;
  public readonly title: string;
  public readonly isbn: string;
  public readonly status?: string;

  protected constructor(payload: BookMappingAllowedFields) {
    super();

    this.id = payload.id;
    this.authorId = payload.authorId;
    this.title = payload.title;
    this.isbn = payload.isbn;
    this.status = payload.status;
  }

  static fromEntity(entity: Book): BookMapping {
    return new BookMapping({
      id: entity.subResourceId,
      authorId: entity.resourceId,
      title: entity.title,
      isbn: entity.isbn,
      status: entity.status
    });
  }

  static fromPayload(payload: BookMappingAllowedFields) {
    return new BookMapping(payload);
  }

  static validateAndConstructFromPayload(payload: BookMappingAllowedFields) {
    BookMapping.validatePayload(payload);
    return BookMapping.fromPayload(payload);
  }

  static validatePayload(payload: BookMappingAllowedFields) {
    BaseMapping.validateIdentifiers(payload.id, payload.authorId);

    if (!payload.title) {
      throw new MappingValidationError('For Book, title is a required field that is a non-empty string');
    }

    if (!payload.isbn) {
      throw new MappingValidationError('For Book, isbn is a required field that is a non-empty string');
    }
  }
}

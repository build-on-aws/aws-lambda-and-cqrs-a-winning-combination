import { BaseMapping } from './base/BaseMapping';
import { MappingValidationError } from './exceptions/MappingValidationError';
import { Rental } from '../model/Rental';

type RentalMappingAllowedFields = {
  userId?: string;
  bookId?: string;
  name: string;
  email: string;
  status?: string;
  comment?: string;
}

export class RentalMapping extends BaseMapping {
  public readonly userId?: string;
  public readonly bookId?: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status?: string;
  public readonly comment?: string;

  protected constructor(payload: RentalMappingAllowedFields) {
    super();

    this.userId = payload.userId;
    this.bookId = payload.bookId;
    this.name = payload.name;
    this.email = payload.email;
    this.status = payload.status;
    this.comment = payload.comment;
  }

  static fromEntity(entity: Rental): RentalMapping {
    return new RentalMapping({
      userId: entity.resourceId,
      bookId: entity.subResourceId,
      name: entity.name,
      email: entity.email,
      status: entity.status,
      comment: entity.comment
    });
  }

  static fromPayload(payload: RentalMappingAllowedFields) {
    return new RentalMapping(payload);
  }

  static validateAndConstructFromPayload(payload: RentalMappingAllowedFields) {
    RentalMapping.validatePayload(payload);
    return RentalMapping.fromPayload(payload);
  }

  static validatePayload(payload: RentalMappingAllowedFields) {
    BaseMapping.validateIdentifiers(payload.userId, payload.bookId);

    if (!payload.name) {
      throw new MappingValidationError('For Rental, name is a required field that is a non-empty string');
    }

    if (!payload.email) {
      throw new MappingValidationError('For Rental, email is a required field that is a non-empty string');
    }
  }

  static emptyMapping(userId: string, bookId: string) {
    return { userId, bookId };
  }
}

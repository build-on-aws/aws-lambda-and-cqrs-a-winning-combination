import { BaseMapping } from './base/BaseMapping';
import { MappingValidationError } from './exceptions/MappingValidationError';
import { User } from '../model/User';

type UserMappingAllowedFields = {
  id?: string;
  name: string;
  email: string;
  status?: string;
  comment?: string
}

export class UserMapping extends BaseMapping {
  public readonly name: string;
  public readonly email: string;
  public readonly status?: string;
  public readonly comment?: string;

  protected constructor(payload: UserMappingAllowedFields) {
    super();

    this.id = payload.id;
    this.name = payload.name;
    this.email = payload.email;
    this.status = payload.status;
    this.comment = payload.comment;
  }

  static fromEntity(entity: User): UserMapping {
    return new UserMapping({
      id: entity.resourceId,
      name: entity.name,
      email: entity.email,
      status: entity.status,
      comment: entity.comment
    });
  }

  static fromPayload(payload: UserMappingAllowedFields) {
    return new UserMapping(payload);
  }

  static validateAndConstructFromPayload(payload: UserMappingAllowedFields) {
    UserMapping.validatePayload(payload);
    return UserMapping.fromPayload(payload);
  }

  static validatePayload(payload: UserMappingAllowedFields) {
    BaseMapping.validateIdentifiers(payload.id);

    if (!payload.name) {
      throw new MappingValidationError('For User, name is a required field that is a non-empty string');
    }

    if (!payload.email) {
      throw new MappingValidationError('For User, email is a required field that is a non-empty string');
    }
  }
}

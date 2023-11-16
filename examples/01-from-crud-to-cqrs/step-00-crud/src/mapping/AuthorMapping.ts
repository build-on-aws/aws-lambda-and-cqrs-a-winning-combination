import moment from 'moment';
import { BaseMapping } from './base/BaseMapping';
import { MappingValidationError } from './exceptions/MappingValidationError';
import { Author } from '../model/Author';

type AuthorMappingAllowedFields = {
  id?: string;
  name: string;
  birthdate: string;
}

export class AuthorMapping extends BaseMapping {
  public readonly name: string;
  public readonly birthdate: string;

  protected constructor(payload: AuthorMappingAllowedFields) {
    super();

    this.id = payload.id;
    this.name = payload.name;
    this.birthdate = payload.birthdate;
  }

  static fromEntity(entity: Author): AuthorMapping {
    return new AuthorMapping({
      id: entity.resourceId,
      name: entity.name,
      birthdate: moment(entity.birthdate).toISOString()
    });
  }

  static fromPayload(payload: AuthorMappingAllowedFields) {
    return new AuthorMapping(payload);
  }

  static validateAndConstructFromPayload(payload: AuthorMappingAllowedFields) {
    AuthorMapping.validatePayload(payload);
    return AuthorMapping.fromPayload(payload);
  }

  static validatePayload(payload: AuthorMappingAllowedFields) {
    BaseMapping.validateIdentifiers(payload.id);

    if (!payload.name) {
      throw new MappingValidationError('For Author, name is a required field that is a non-empty string');
    }

    if (!payload.birthdate) {
      throw new MappingValidationError('For Author, birthdate is a required field that is a non-empty string');
    }

    if (!moment(payload.birthdate).isValid()) {
      throw new MappingValidationError('For Author, birthdate is a string field that must convert to date and time');
    }
  }
}

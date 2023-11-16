import KSUID from 'ksuid';
import { MappingValidationError } from '../exceptions/MappingValidationError';

export abstract class BaseMapping {
  public id?: string;

  static emptyMapping(identifier: string) {
    return { id: identifier };
  }

  static validateIdentifiers(primaryIdentifier?: string, secondaryIdentifier?: string) {
    if (primaryIdentifier) {
      try {
        KSUID.parse(primaryIdentifier);
      } catch (error: any) {
        throw new MappingValidationError('The provided primary ID must be a valid KSUID');
      }
    }

    if (secondaryIdentifier) {
      try {
        KSUID.parse(secondaryIdentifier);
      } catch (error: any) {
        throw new MappingValidationError('The provided secondary ID must be a valid KSUID');
      }
    }
  }
}

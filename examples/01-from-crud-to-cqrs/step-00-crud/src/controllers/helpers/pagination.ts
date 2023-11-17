import { Request } from 'express';
import { LibraryTablePrimaryKey } from "../../model/base/LibraryTable";

type KeyConstructorFunction = (pk: string, sk?: string) => LibraryTablePrimaryKey;

export const DEFAULT_PAGE_SIZE = 100;
export const DEFAULT_SORT_ORDER = 'ascending';

export const extractPaginationDetails = <T extends KeyConstructorFunction>(req: Request, keyConstructor: T) => {
  const rawLastKey = req.query.lastKey;
  let startAtKey = undefined;

  if (rawLastKey) {
    if (typeof rawLastKey === 'string') {
      startAtKey = keyConstructor(rawLastKey, undefined);
    } else if (rawLastKey instanceof Array) {
      if (rawLastKey.length === 1 && typeof rawLastKey[0] === 'string') {
        startAtKey = keyConstructor(rawLastKey[0], rawLastKey[0]);
      } else if (rawLastKey.length === 2 && typeof rawLastKey[0] === 'string' && typeof rawLastKey[1] === 'string') {
        startAtKey = keyConstructor(rawLastKey[0], rawLastKey[1]);
      }
    }
  }

  return {
    startAtKey,
    pageSize: req.query.pageSize || DEFAULT_PAGE_SIZE,
    sortOrder: req.query.sortOrder || DEFAULT_SORT_ORDER,
  };
};

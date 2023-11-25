import { Request } from "express";
import { PaginationParameters } from "../database/IDatabaseProvider";

export const DEFAULT_LIMIT = 100;
export const DEFAULT_SCAN_INDEX_FORWARD = true;

export const extractPaginationDetails = (req: Request): PaginationParameters => {
  const rawNext = req.query.next;
  let ExclusiveStartKey = undefined;

  if (rawNext && rawNext instanceof Array && rawNext.length === 1) {
    ExclusiveStartKey = {
      resourceId: { S: rawNext[0] as string },
      subResourceId: { S: rawNext[0] as string },
    };
  }

  if (rawNext && rawNext instanceof Array && rawNext.length === 2) {
    ExclusiveStartKey = {
      resourceId: { S: rawNext[0] as string },
      subResourceId: { S: rawNext[1] as string },
    };
  }

  const rawPageSize = req.query.pageSize;
  let Limit = DEFAULT_LIMIT;

  if (rawPageSize && typeof rawPageSize === "string") {
    Limit = parseInt(rawPageSize, 10) || DEFAULT_LIMIT;
  }

  const rawSortOrder = req.query.sortOrder;
  let ScanIndexForward = DEFAULT_SCAN_INDEX_FORWARD;

  if (rawSortOrder && rawSortOrder === "descending") {
    ScanIndexForward = false;
  }

  return {
    ExclusiveStartKey,
    Limit,
    ScanIndexForward,
  };
};

export const extractFiltering = (req: Request, name: string) => {
  const rawValueForFilteringField = req.query[name];

  if (rawValueForFilteringField) {
    return { value: rawValueForFilteringField as string };
  } else {
    return undefined;
  }
};

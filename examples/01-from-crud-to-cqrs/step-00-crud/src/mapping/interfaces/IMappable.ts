import { BaseMapping } from "../base/BaseMapping";

export interface IMappable {
  toMapping(): BaseMapping;
}

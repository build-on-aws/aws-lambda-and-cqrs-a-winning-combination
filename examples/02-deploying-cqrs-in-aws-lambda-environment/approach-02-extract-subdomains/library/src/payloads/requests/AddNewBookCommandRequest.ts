import { Author } from "library-system-common/models";

export type AddNewBookCommandRequest = {
  author: Author;
  title: string;
  isbn: string;
};

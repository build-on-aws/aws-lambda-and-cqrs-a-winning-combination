import { Author } from "../../models/Author";

export type AddNewBookCommandRequest = {
  author: Author;
  title: string;
  isbn: string;
};

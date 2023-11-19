export type Author = {
  id: string;
  name: string;
  birthdate: string;
};

export type AuthorUpdateModel = {
  name?: string;
  birthdate?: string;
};

export type AuthorKey = {
  id: string;
};

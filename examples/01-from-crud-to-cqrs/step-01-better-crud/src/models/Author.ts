export type AuthorRequestPayload = {
  name: string;
  birthdate: string;
};

export type Author = {
  id: string;
  name: string;
  birthdate: string;
};

export type AuthorUpdateModel = {
  name?: string;
  birthdate?: string;
};

export type AuthorPrimaryKey = {
  id: string;
};

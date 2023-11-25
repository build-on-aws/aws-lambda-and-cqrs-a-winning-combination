export enum UserStatus {
  NOT_VERIFIED = "NOT_VERIFIED",
  VERIFIED = "VERIFIED",
  SUSPENDED = "SUSPENDED",
}

export type UserRequestPayload = {
  name: string;
  email: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  comment: string;
};

export type UserUpdateModel = {
  name?: string;
  email?: string;
  status?: UserStatus;
  comment?: string;
};

export type UserPrimaryKey = {
  id: string;
};

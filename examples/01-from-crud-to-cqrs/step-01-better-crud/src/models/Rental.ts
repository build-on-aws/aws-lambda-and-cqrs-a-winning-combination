export enum RentalStatus {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
}

export type Rental = {
  bookId: string;
  userId: string;
  status: RentalStatus;
  comment: string;
};

export type RentalUpdateModel = {
  status?: RentalStatus;
  comment?: string;
};

export type RentalPrimaryKey = {
  bookId: string;
  userId: string;
};

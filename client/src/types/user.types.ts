export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  bio?: string;
  birthDate?: Date;
  photoURL?: string;
  emailVerified?: boolean;
  createdAt?: Date;
}

export type CreateUser = Pick<
  User,
  "email" | "firstName" | "lastName" | "photoURL"
> & {
  password: string;
};

export type SignInUser = Pick<User, "email"> & {
  password: string;
};

export type UpdateUser = Partial<
  Omit<User, "id" | "email" | "createdAt" | "emailVerified">
>;

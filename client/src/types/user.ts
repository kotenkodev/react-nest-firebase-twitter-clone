export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  birthDate?: Date;
  location?: string;
  photoUrl?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface CreateUserForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserForm {
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  birthDate?: Date;
  location?: string;
  photoUrl?: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

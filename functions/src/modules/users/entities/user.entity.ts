export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  photoURL?: string;
  birthDate?: Date;
  emailVerified?: boolean;
  createdAt: Date;
}

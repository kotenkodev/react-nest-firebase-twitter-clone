export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

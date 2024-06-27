export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  role?: string;

  [key: string]: unknown;
}

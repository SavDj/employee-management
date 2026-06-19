export type Role = 'Employee' | 'Manager';

export interface User {
  userId: string;
  fullName: string;
  role: Role;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  role: Role;
}
import type { EPrincipalType } from '../auth/auth.entity';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  principalType: EPrincipalType;
  role?: EUserRole;
  active?: boolean;
  createdAt?: Date;
}

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type EUserRole = (typeof UserRole)[keyof typeof UserRole];

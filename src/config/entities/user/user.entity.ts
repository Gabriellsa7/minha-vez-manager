import type { EPrincipalType } from '../auth/auth.entity';
import type { EHealthProfessionalType } from '../health-profissional/health-professional.entity';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  principalType: EPrincipalType;
  role?: EUserRole;
  healthProfessionalType?: EHealthProfessionalType;
  healthUnitId?: string;
  active?: boolean;
  createdAt?: Date;
}

// SUPER_ADMIN: network administrator, creates the clinic administrators.
// ADMIN: clinic administrator, manages its own health units.
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type EUserRole = (typeof UserRole)[keyof typeof UserRole];

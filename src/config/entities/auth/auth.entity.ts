import type { EUserRole } from '../user/user.entity';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthToken {
  token: string;
  expiresAt: Date;
}

export const HealthProfessionalRole = {
  USER: 'USER',
  HEALTH_PROFESSIONAL: 'HEALTH_PROFESSIONAL',
} as const;

export type EPrincipalType =
  (typeof HealthProfessionalRole)[keyof typeof HealthProfessionalRole];

export interface IAuthPrincipal {
  id: string;
  name: string;
  email: string;
  role?: EUserRole;
}

export interface IAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;

  principalType: EPrincipalType;

  principal: IAuthPrincipal;
}

export interface IAuthPayload {
  sub: string;
  email: string;
  name: string;
  principalType: EPrincipalType;
  role?: EUserRole;
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

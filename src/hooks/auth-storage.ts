import type { IAuthTokenResponse } from '../config/entities/auth/auth.entity';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '../config/entities/commons/commons.constants';

function decodeAccessTokenUserId(token: string): string | undefined {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );

    return typeof json.sub === 'string' ? json.sub : undefined;
  } catch {
    return undefined;
  }
}

export const authStorage = {
  save(tokens: IAuthTokenResponse) {
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.accessToken);

    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  getAccessToken() {
    return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  },

  // Identifica o usuário logado a partir do token, sem depender da resposta
  // de /users/me. Usado para isolar preferências salvas localmente (ex.:
  // tema) entre contas diferentes no mesmo navegador.
  getUserId() {
    const token = this.getAccessToken();
    return token ? decodeAccessTokenUserId(token) : undefined;
  },

  getRefreshToken() {
    return localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  },
};

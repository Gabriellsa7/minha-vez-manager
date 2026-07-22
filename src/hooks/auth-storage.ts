import type { IAuthTokenResponse } from '../config/entities/auth/auth.entity';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '../config/entities/commons/commons.constants';

export const authStorage = {
  save(tokens: IAuthTokenResponse) {
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.accessToken);

    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  getAccessToken() {
    return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  },
};

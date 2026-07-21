import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from '../../config/entities/commons/commons.constants';

export function setAccessToken(token: string) {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, token);
}

export function redirectToLoginPage() {
  window.location.replace('/login');
}

import { authStorage } from '../../hooks/auth-storage';
import { LOGIN_ROUTE } from './constants';

function redirectToLogin() {
  window.location.replace(LOGIN_ROUTE);
}

export function handleUnauthorizedResponse() {
  authStorage.clear();
  redirectToLogin();
}

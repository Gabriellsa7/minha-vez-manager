import { clearAccessToken } from '../../config/utils';
import { LOGIN_ROUTE } from './constants';

function redirectToLogin() {
  window.location.replace(LOGIN_ROUTE);
}

export function handleUnauthorizedResponse() {
  clearAccessToken();
  redirectToLogin();
}
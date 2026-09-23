import { authStorage } from '../hooks/auth-storage';
import { queryClient } from './react-query';

export function endSession() {
  authStorage.clear();
  queryClient.clear();
}

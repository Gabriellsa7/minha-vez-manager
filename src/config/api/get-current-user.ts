import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

const GET_CURRENT_USER = 'GET_CURRENT_USER';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const getCurrentUser = async () => {
  const { data } = await apiClient.get<IUser>('/users/me');

  return data;
};

export const useCurrentUser = (
  options?: Omit<
    UseQueryOptions<IUser>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_CURRENT_USER],
    queryFn: getCurrentUser,
    ...options,
  });
};
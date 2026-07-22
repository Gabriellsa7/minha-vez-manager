import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IUser } from '../entities/user/user.entity';

const GET_CURRENT_USER = 'GET_CURRENT_USER';

export type GetUserParamsResponse = IUser;

const getCurrentUser = async (): Promise<GetUserParamsResponse> => {
  const response = await apiClient.get<GetUserParamsResponse>('/users/me');

  return response.data;
};

export const useCurrentUser = (
  options?: Omit<UseQueryOptions<GetUserParamsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_CURRENT_USER],
    queryFn: getCurrentUser,
    ...options,
  });
};

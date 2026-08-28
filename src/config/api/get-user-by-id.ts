import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

export interface IUserBasicInfo {
  _id: string;
  name: string;
  email: string;
}

export const GET_USER_BY_ID_KEY = 'GET_USER_BY_ID_KEY';

const getUserById = async (id: string): Promise<IUserBasicInfo> => {
  const path = `/users/${id}`;

  const response = await apiClient.get<IUserBasicInfo>(path);

  return response.data;
};

export const useUserById = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<IUserBasicInfo>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_USER_BY_ID_KEY, id],
    queryFn: () => getUserById(id!),
    enabled: Boolean(id),
    ...options,
  });
};

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  _id: string;
  name: string;
  email: string;
}

const postUser = async (
  params: CreateUserParams
): Promise<CreateUserResponse> => {
  const { data } = await apiClient.post<CreateUserResponse>(
    '/users',
    params
  );

  return data;
};

export const usePostUser = (
  options?: UseMutationOptions<CreateUserResponse, unknown, CreateUserParams>
) => useMutation({ mutationFn: postUser, ...options });

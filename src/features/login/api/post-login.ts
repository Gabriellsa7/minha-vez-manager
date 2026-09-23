import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { IAuthTokenResponse } from '../../../config/entities/auth/auth.entity';
import { apiClient } from '../../../services/axios';

export const POST_LOGIN_KEY = 'POST_LOGIN_KEY';

export interface PostLoginParams {
  email: string;
  password: string;
}

type PostLoginResponse = IAuthTokenResponse;

const postLogin = async (
  params: PostLoginParams
): Promise<PostLoginResponse> => {
  const path = '/auth/login';

  const response = await apiClient.post<PostLoginResponse>(path, params);

  return response.data;
};

export const usePostLogin = (
  options?: UseMutationOptions<PostLoginResponse, unknown, PostLoginParams>
) => {
  return useMutation({
    mutationFn: postLogin,
    ...options,
  });
};

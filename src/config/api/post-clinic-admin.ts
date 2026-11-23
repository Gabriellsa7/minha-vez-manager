import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IUser } from '../entities/user/user.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_CLINIC_ADMINS_KEY } from './get-clinic-admins';

export interface CreateClinicAdminParams {
  name: string;
  email: string;
  password: string;
}

const postClinicAdmin = async (
  params: CreateClinicAdminParams
): Promise<IUser> => {
  const { data } = await apiClient.post<IUser>('/admins', params);
  return data;
};

export const usePostClinicAdmin = (
  options?: UseMutationOptions<IUser, unknown, CreateClinicAdminParams>
) =>
  useMutation({
    mutationFn: postClinicAdmin,
    ...withInvalidation([GET_CLINIC_ADMINS_KEY], options),
  });

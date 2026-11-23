import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IUser } from '../entities/user/user.entity';

export const GET_CLINIC_ADMINS_KEY = 'GET_CLINIC_ADMINS_KEY';

export type GetClinicAdminsResponse = IUser[];

const getClinicAdmins = async (): Promise<GetClinicAdminsResponse> => {
  const { data } = await apiClient.get<GetClinicAdminsResponse>('/admins');
  return data;
};

export const useClinicAdmins = (
  options?: Omit<
    UseQueryOptions<GetClinicAdminsResponse>,
    'queryKey' | 'queryFn'
  >
) =>
  useQuery({
    queryKey: [GET_CLINIC_ADMINS_KEY],
    queryFn: getClinicAdmins,
    ...options,
  });

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IReceptionist } from '../entities/receptionist/receptionist.entity';

export interface CreateReceptionistParams {
  healthUnitId: string;
  name: string;
  email: string;
  password: string;
}

const postReceptionist = async (
  params: CreateReceptionistParams
): Promise<IReceptionist> => {
  const { data } = await apiClient.post<IReceptionist>(
    '/receptionists',
    params
  );

  return data;
};

export const usePostReceptionist = (
  options?: UseMutationOptions<IReceptionist, unknown, CreateReceptionistParams>
) => useMutation({ mutationFn: postReceptionist, ...options });

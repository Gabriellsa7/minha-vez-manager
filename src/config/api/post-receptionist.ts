import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IReceptionist } from '../entities/receptionist/receptionist.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY } from './get-receptionists-by-health-unit-id';

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
) =>
  useMutation({
    mutationFn: postReceptionist,
    ...withInvalidation([GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY], options),
  });

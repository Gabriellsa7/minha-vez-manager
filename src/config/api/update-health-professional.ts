import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthProfessional } from '../entities/health-profissional/health-professional.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_HEALTH_PROFESSIONALS_BY_USER_ID } from './get-health-professionals-by-user-id';
import { GET_HEALTH_PROFESSIONAL_BY_USER_ID } from './get-health-professional-by-id';
import { GET_HEALTH_PROFESSIONALS_KEY } from './get-health-professionals';

export interface UpdateHealthProfessionalParams {
  id: string;
  data: Partial<
    Pick<
      IHealthProfessional,
      'name' | 'specialty' | 'room' | 'professionalLicense' | 'schedule'
    >
  >;
}

const updateHealthProfessional = async ({
  id,
  data,
}: UpdateHealthProfessionalParams): Promise<IHealthProfessional> => {
  const path = `/health-professionals/${id}`;

  const response = await apiClient.put<IHealthProfessional>(path, data);

  return response.data;
};

export const useUpdateHealthProfessional = (
  options?: UseMutationOptions<
    IHealthProfessional,
    unknown,
    UpdateHealthProfessionalParams
  >
) =>
  useMutation({
    mutationFn: updateHealthProfessional,
    ...withInvalidation(
      [
        GET_HEALTH_PROFESSIONALS_BY_USER_ID,
        GET_HEALTH_PROFESSIONAL_BY_USER_ID,
        GET_HEALTH_PROFESSIONALS_KEY,
      ],
      options
    ),
  });

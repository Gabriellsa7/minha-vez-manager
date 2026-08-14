import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthProfessional } from '../entities/health-profissional/health-professional.entity';

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
    ...options,
  });

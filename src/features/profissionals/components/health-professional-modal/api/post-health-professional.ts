import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../../../services/axios';
import type {
  EHealthProfessionalType,
  IHealthProfessional,
  IHealthProfessionalSchedule,
} from '../../../../../config/entities/health-profissional/health-professional.entity';

export interface CreateHealthProfessionalParams {
  userId?: string;
  healthUnitId: string;
  name: string;
  email: string;
  room: string;
  password: string;
  specialty: string;
  professionalLicense: string;
  type: EHealthProfessionalType;
  schedule: IHealthProfessionalSchedule;
}

const postHealthProfessional = async (
  params: CreateHealthProfessionalParams
): Promise<IHealthProfessional> => {
  const { data } = await apiClient.post<IHealthProfessional>(
    '/health-professionals',
    params
  );

  return data;
};

export const usePostHealthProfessional = (
  options?: UseMutationOptions<
    IHealthProfessional,
    unknown,
    CreateHealthProfessionalParams
  >
) => useMutation({ mutationFn: postHealthProfessional, ...options });

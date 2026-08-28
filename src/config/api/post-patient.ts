import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type {
  EPatientPriority,
  IPatient,
} from '../entities/patient/patient.entity';

export interface CreatePatientParams {
  userId: string;
  cpf: string;
  birthDate: string;
  phone: string;
  priority: EPatientPriority;
}

const postPatient = async (params: CreatePatientParams): Promise<IPatient> => {
  const { data } = await apiClient.post<IPatient>('/patients', params);

  return data;
};

export const usePostPatient = (
  options?: UseMutationOptions<IPatient, unknown, CreatePatientParams>
) => useMutation({ mutationFn: postPatient, ...options });

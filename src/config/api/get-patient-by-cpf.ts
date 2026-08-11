import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IPatient } from '../entities/patient/patient.entity';

export const GET_PATIENT_BY_CPF_KEY = 'GET_PATIENT_BY_CPF_KEY';

const getPatientByCpf = async (cpf: string): Promise<IPatient> => {
  const path = `/patients/cpf/${encodeURIComponent(cpf)}`;

  const response = await apiClient.get<IPatient>(path);

  return response.data;
};

export const useGetPatientByCpf = (
  cpf: string,
  options?: Omit<UseQueryOptions<IPatient>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_PATIENT_BY_CPF_KEY, cpf],
    queryFn: () => getPatientByCpf(cpf),
    enabled: false,
    retry: false,
    ...options,
  });
};

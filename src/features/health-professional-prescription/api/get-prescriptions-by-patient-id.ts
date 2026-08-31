import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '../../../services/axios';
import type { IPrescription } from '../../../config/entities/prescription/prescription.entity';

export const GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY =
  'GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY';

const getPrescriptionsByPatientId = async (
  patientId: string
): Promise<IPrescription[]> => {
  try {
    const { data } = await apiClient.get<IPrescription[]>(
      `/patients/${patientId}/prescriptions`
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const useGetPrescriptionsByPatientId = (
  patientId: string | undefined,
  options?: Omit<UseQueryOptions<IPrescription[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: [GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY, patientId],
    queryFn: () => getPrescriptionsByPatientId(patientId!),
    enabled: Boolean(patientId),
    ...options,
  });

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';
import type { IPrescription } from '../../../config/entities/prescription/prescription.entity';

export interface CreatePrescriptionExamParams {
  examOfferingId: string;
}

export interface CreatePrescriptionParams {
  patientId: string;
  queueItemId?: string;
  medications?: string;
  observations?: string;
  exams: CreatePrescriptionExamParams[];
}

const postPrescription = async (
  params: CreatePrescriptionParams
): Promise<IPrescription> => {
  const { data } = await apiClient.post<IPrescription>(
    '/prescriptions',
    params
  );

  return data;
};

export const usePostPrescription = (
  options?: UseMutationOptions<IPrescription, unknown, CreatePrescriptionParams>
) =>
  useMutation({
    mutationFn: postPrescription,
    ...options,
  });

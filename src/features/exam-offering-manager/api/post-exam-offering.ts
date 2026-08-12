import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';
import type { IExamOffering } from '../../../config/entities/exam-offering/exam-offering.entity';

export interface CreateExamOfferingParams {
  healthUnitId: string;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  sampleType?: string;
  durationMinutes: number;
  resultTurnaroundEstimate?: string;
  requiresPreparation: boolean;
  preparationInstructions?: string;
  requiresFasting: boolean;
  fastingHours?: number;
  price?: number;
  acceptedInsurances: string[];
}

const postExamOffering = async (
  params: CreateExamOfferingParams
): Promise<IExamOffering> => {
  const { healthUnitId, ...body } = params;

  const { data } = await apiClient.post<IExamOffering>(
    `/health-units/${healthUnitId}/exam-offerings`,
    body
  );

  return data;
};

export const usePostExamOffering = (
  options?: UseMutationOptions<IExamOffering, unknown, CreateExamOfferingParams>
) =>
  useMutation({
    mutationFn: postExamOffering,
    ...options,
  });

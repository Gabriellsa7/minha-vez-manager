import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';
import type { IExamOffering } from '../../../config/entities/exam-offering/exam-offering.entity';

export interface UpdateExamOfferingParams {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  category?: string;
  sampleType?: string;
  durationMinutes?: number;
  resultTurnaroundEstimate?: string;
  requiresPreparation?: boolean;
  preparationInstructions?: string;
  requiresFasting?: boolean;
  fastingHours?: number;
  price?: number;
  acceptedInsurances?: string[];
  isActive?: boolean;
}

const patchExamOffering = async (
  params: UpdateExamOfferingParams
): Promise<IExamOffering> => {
  const { id, ...body } = params;

  const { data } = await apiClient.patch<IExamOffering>(
    `/exam-offerings/${id}`,
    body
  );

  return data;
};

export const usePatchExamOffering = (
  options?: UseMutationOptions<IExamOffering, unknown, UpdateExamOfferingParams>
) =>
  useMutation({
    mutationFn: patchExamOffering,
    ...options,
  });

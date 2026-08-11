import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';
import type { IExam } from '../../../config/entities/exam/exam.entity';

export interface CreateExamParams {
  patientCpf: string;
  healthUnitId: string;
  examType: string;
  examDate?: string;
  doctorName?: string;
  notes?: string;
  fileBase64: string;
  fileName: string;
  mimeType: string;
}

const postExam = async (params: CreateExamParams): Promise<IExam> => {
  const { data } = await apiClient.post<IExam>('/exams', params);

  return data;
};

export const usePostExam = (
  options?: UseMutationOptions<IExam, unknown, CreateExamParams>
) =>
  useMutation({
    mutationFn: postExam,
    ...options,
  });

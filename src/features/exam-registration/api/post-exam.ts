import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';
import type { IExam } from '../../../config/entities/exam/exam.entity';
import { withInvalidation } from '../../../services/react-query';
import { GET_EXAMS_BY_HEALTH_UNIT_ID_KEY } from '../../../config/api/get-exams-by-health-unit-id';
import { GET_EXAMS_BY_HEALTH_PROFESSIONAL_ID_KEY } from '../../../config/api/get-exams-by-health-professional-id';
import { GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY } from '../../../config/api/get-exam-bookings-by-patient-id';
import { GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY } from '../../../config/api/get-exam-bookings-by-health-unit-id';

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
  examBookingId?: string;
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
    ...withInvalidation(
      [
        GET_EXAMS_BY_HEALTH_UNIT_ID_KEY,
        GET_EXAMS_BY_HEALTH_PROFESSIONAL_ID_KEY,
        GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY,
        GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY,
      ],
      options
    ),
  });

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type {
  ExamBookingStatus,
  IExamBooking,
} from '../entities/exam-booking/exam-booking.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY } from './get-exam-bookings-by-health-unit-id';
import { GET_EXAM_SLOTS_KEY } from './get-exam-slots';

export interface PatchExamBookingStatusParams {
  id: string;
  status: ExamBookingStatus;
}

const patchExamBookingStatus = async (
  params: PatchExamBookingStatusParams
): Promise<IExamBooking> => {
  const { data } = await apiClient.patch<IExamBooking>(
    `/exam-bookings/${params.id}/status`,
    { status: params.status }
  );

  return data;
};

export const usePatchExamBookingStatus = (
  options?: UseMutationOptions<
    IExamBooking,
    unknown,
    PatchExamBookingStatusParams
  >
) =>
  useMutation({
    mutationFn: patchExamBookingStatus,
    ...withInvalidation(
      [GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY, GET_EXAM_SLOTS_KEY],
      options
    ),
  });

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';
import type { IAppointment } from '../../../config/entities/appointments/appointment.entity';
import { withInvalidation } from '../../../services/react-query';
import { GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY } from '../../../config/api/get-appointments-by-professional-id';
import { GET_QUEUE_MANAGEMENT } from './get-queue-management-by-professional-id';
import { GET_QUEUES_BY_PROFESSIONAL_ID } from './get-queues-by-professional-id';
import { GET_AVAILABLE_SLOTS_KEY } from '../../../config/api/get-available-slots';

export interface CreateAppointmentParams {
  patientId: string;
  professionalId: string;
  healthUnitId: string;
  dateTime: string;
  notes?: string;
  isReturn?: boolean;
  originQueueItemId?: string;
}

const createAppointment = async (
  params: CreateAppointmentParams
): Promise<IAppointment> => {
  const { data } = await apiClient.post<IAppointment>('/appointments', params);

  return data;
};

export const useCreateAppointment = (
  options?: UseMutationOptions<IAppointment, unknown, CreateAppointmentParams>
) =>
  useMutation({
    mutationFn: createAppointment,
    ...withInvalidation(
      [
        GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY,
        GET_QUEUE_MANAGEMENT,
        GET_QUEUES_BY_PROFESSIONAL_ID,
        GET_AVAILABLE_SLOTS_KEY,
      ],
      options
    ),
  });

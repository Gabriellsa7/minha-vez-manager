import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IHealthProfessional } from '../entities/health-profissional/health-professional.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_HEALTH_PROFESSIONAL_BY_USER_ID } from './get-health-professional-by-id';
import { GET_HEALTH_PROFESSIONALS_BY_USER_ID } from './get-health-professionals-by-user-id';

export interface UploadHealthProfessionalImageParams {
  id: string;
  imageBase64: string;
  fileName: string;
  mimeType: string;
}

const uploadHealthProfessionalImage = async ({
  id,
  imageBase64,
  fileName,
  mimeType,
}: UploadHealthProfessionalImageParams): Promise<IHealthProfessional> => {
  const path = `/health-professionals/${id}/image`;

  const response = await apiClient.post<IHealthProfessional>(path, {
    imageBase64,
    fileName,
    mimeType,
  });

  return response.data;
};

export const useUploadHealthProfessionalImage = (
  options?: UseMutationOptions<
    IHealthProfessional,
    unknown,
    UploadHealthProfessionalImageParams
  >
) =>
  useMutation({
    mutationFn: uploadHealthProfessionalImage,
    ...withInvalidation(
      [GET_HEALTH_PROFESSIONAL_BY_USER_ID, GET_HEALTH_PROFESSIONALS_BY_USER_ID],
      options
    ),
  });

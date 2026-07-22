import axios from 'axios';
import { toast } from 'react-toastify';

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    toast.error(
      error.response?.data?.message ?? 'Ocorreu um erro na requisição.'
    );

    return;
  }

  toast.error('Ocorreu um erro inesperado.');
};

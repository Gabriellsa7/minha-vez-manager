import axios from 'axios';
import { toast } from 'react-toastify';

const STATUS_FALLBACK_MESSAGES: Record<number, string> = {
  401: 'Sua sessão expirou. Faça login novamente.',
  403: 'Você não tem permissão para realizar essa ação.',
  404: 'Não foi possível encontrar o recurso solicitado.',
  409: 'Esse registro já existe ou está em conflito com outro.',
  422: 'Verifique os dados preenchidos e tente novamente.',
};

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      toast.error(
        'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      );
      return;
    }

    const { status, data } = error.response;
    const backendMessage = data?.message;

    if (backendMessage) {
      toast.error(
        Array.isArray(backendMessage)
          ? backendMessage.join(' ')
          : backendMessage
      );
      return;
    }

    if (status >= 500) {
      toast.error('Erro no servidor. Tente novamente em instantes.');
      return;
    }

    toast.error(
      STATUS_FALLBACK_MESSAGES[status] ?? 'Ocorreu um erro na requisição.'
    );

    return;
  }

  toast.error('Ocorreu um erro inesperado.');
};

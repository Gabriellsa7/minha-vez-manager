import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from '../../config/entities/commons/commons.constants';
import { isAxiosError } from 'axios';

export function getAccessToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
}

export function clearAccessToken(): void {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
}

export function isApiClientError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return typeof status === 'number' && status >= 400 && status < 500;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (!isAxiosError(error)) {
    return fallbackMessage;
  }

  const message = error.response?.data?.message;

  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return fallbackMessage;
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes}min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}

export function getElapsedMinutes(createdAt: string): number {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();

  return Math.max(Math.floor((now - createdTime) / 60000), 0);
}

export {
  DATE_INPUT_FORMAT,
  formatDateDisplayValue,
  formatDateInputValue,
  normalizeDateInputRange,
  parseDateInputValue,
  toApiDateRange,
} from './data-input';

export function getUserInitials(name: string): string {
  if (!name.trim()) return '';

  const names = name.trim().split(/\s+/);

  const firstInitial = names[0][0].toUpperCase();

  if (names.length === 1) {
    return firstInitial;
  }

  const lastInitial = names[names.length - 1][0].toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export const formatDateTime = (date?: string | Date) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  const formattedDate = parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const formattedTime = parsedDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formattedDate} ${formattedTime}`;
};

export const formatTime = (date?: string | Date) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  const formattedTime = parsedDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formattedTime}`;
};

export const formatDate = (date?: string | Date) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  const formattedDate = parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return `${formattedDate}`;
};

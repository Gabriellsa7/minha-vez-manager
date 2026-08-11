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

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const normalizeEmail = (value: string) =>
  value.replace(/\s/g, '').toLowerCase();

export const formatCpf = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const formatZipCode = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
};

export const getDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
};

export const getDateTimeFromDateAndTime = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute);
};

export const isSameMonth = (firstDate: Date, secondDate: Date) =>
  firstDate.getFullYear() === secondDate.getFullYear() &&
  firstDate.getMonth() === secondDate.getMonth();

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function generateTimes(
  start: string,
  end: string,
  duration: number
): string[] {
  if (!start || !end || !duration) return [];

  const times: string[] = [];

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  let current = startHour * 60 + startMinute;
  const finish = endHour * 60 + endMinute;

  while (current + duration <= finish) {
    const hour = Math.floor(current / 60);
    const minute = current % 60;

    times.push(
      `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`
    );

    current += duration;
  }

  return times;
}

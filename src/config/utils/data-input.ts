import {
  endOfDay,
  format,
  isValid,
  max,
  min,
  parse,
  startOfDay,
} from 'date-fns';

export const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

export function formatDateInputValue(date: Date): string {
  return format(date, DATE_INPUT_FORMAT);
}

export function parseDateInputValue(dateInput: string): Date | undefined {
  if (!dateInput) {
    return undefined;
  }

  const date = parse(dateInput, DATE_INPUT_FORMAT, new Date());

  return isValid(date) ? date : undefined;
}

export function formatDateDisplayValue(dateInput: string): string {
  const date = parseDateInputValue(dateInput);

  if (!date) {
    return '';
  }

  return format(date, 'dd/MM/yyyy');
}

export function normalizeDateInputRange(
  startDate: string,
  endDate: string
): { startDate: string; endDate: string } {
  const start = parseDateInputValue(startDate);
  const end = parseDateInputValue(endDate);

  if (!start || !end) {
    return { startDate, endDate };
  }

  const rangeStart = min([start, end]);
  const rangeEnd = max([start, end]);

  return {
    startDate: formatDateInputValue(rangeStart),
    endDate: formatDateInputValue(rangeEnd),
  };
}

export function toApiDateRange(startDate: string, endDate: string) {
  const { startDate: rangeStart, endDate: rangeEnd } = normalizeDateInputRange(
    startDate,
    endDate
  );

  const start = parseDateInputValue(rangeStart);
  const end = parseDateInputValue(rangeEnd);

  if (!start || !end) {
    return { startDate: '', endDate: '' };
  }

  return {
    startDate: startOfDay(start).toISOString(),
    endDate: endOfDay(end).toISOString(),
  };
}
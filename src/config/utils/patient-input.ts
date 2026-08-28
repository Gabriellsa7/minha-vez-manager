export const isValidCpf = (value: string) => {
  const cpf = value.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calculateDigit(9);
  const secondDigit = calculateDigit(10);

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
};

export const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
};

export const isValidBirthDate = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 8) return false;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) return false;

  const minYear = today.getFullYear() - 120;
  if (year < minYear) return false;

  return true;
};

export const formatBirthDate = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const normalizeBirthDate = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length !== 8) return value;

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return `${year}-${month}-${day}`;
};

/**
 * Exam-scheduling dates/times are matched against availability rules in the
 * backend using UTC getters (no timezone is tracked anywhere in
 * HealthUnit/ExamAvailabilityRule) — same convention the mobile app's
 * `getExamDateTimeFromDateAndTime` already relies on. Appointment booking
 * uses real local-time `Date`s instead; mixing the two conventions is what
 * produces the backend's "Invalid time slot" error, since the UTC hour sent
 * would be off by the browser's timezone offset.
 */
export const getExamDateTimeFromDateAndTime = (
  date: string,
  time: string,
): Date => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute));
};

export const calculateAge = (birthDate: string): number | null => {
  const [year, month, day] = birthDate.split('-').map(Number);
  if (!year || !month || !day) return null;

  const today = new Date();
  let age = today.getFullYear() - year;

  const hasHadBirthdayThisYear =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
};

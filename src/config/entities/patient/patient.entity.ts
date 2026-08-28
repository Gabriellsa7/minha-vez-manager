export interface IPatient {
  _id: string;
  userId: string;
  cpf: string;
  birthDate: string;
  priority: EPatientPriority;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const patientPriority = {
  NORMAL: 'NORMAL',
  ELDERLY: 'ELDERLY',
  PREGNANT: 'PREGNANT',
  DISABLED: 'DISABLED',
  CHRONIC_CONDITION: 'CHRONIC_CONDITION',
} as const;

export type EPatientPriority =
  (typeof patientPriority)[keyof typeof patientPriority];

export const PRIORITY_LABEL: Record<EPatientPriority, string> = {
  [patientPriority.NORMAL]: 'Nenhuma prioridade',
  [patientPriority.ELDERLY]: 'Idoso (60+)',
  [patientPriority.PREGNANT]: 'Gestante',
  [patientPriority.DISABLED]: 'Pessoa com deficiência (PCD)',
  [patientPriority.CHRONIC_CONDITION]: 'Doença crônica ou condição de saúde',
};

export const PRIORITY_REASON_OPTIONS = [
  patientPriority.NORMAL,
  patientPriority.PREGNANT,
  patientPriority.DISABLED,
  patientPriority.CHRONIC_CONDITION,
] as const;

export const ELDERLY_AGE_THRESHOLD = 60;

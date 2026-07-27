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
} as const;

export type EPatientPriority =
  (typeof patientPriority)[keyof typeof patientPriority];

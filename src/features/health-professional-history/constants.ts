import { patientPriority } from '../../config/entities/patient/patient.entity';

export const PRIORITY_LABEL: Record<string, string> = {
  [patientPriority.NORMAL]: 'Normal',
  [patientPriority.ELDERLY]: 'Idoso',
  [patientPriority.PREGNANT]: 'Gestante',
  [patientPriority.DISABLED]: 'PCD',
  [patientPriority.CHRONIC_CONDITION]: 'Doença crônica',
};

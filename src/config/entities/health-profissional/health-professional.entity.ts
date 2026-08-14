export const healthProfessionalType = {
  GENERAL: 'GENERAL',
  EXAM_PROFESSIONAL: 'EXAM_PROFESSIONAL',
} as const;

export type EHealthProfessionalType =
  (typeof healthProfessionalType)[keyof typeof healthProfessionalType];

export interface IHealthProfessional {
  _id: string;
  userId?: string;
  healthUnitId: string;
  specialty: string;
  name: string;
  email: string;
  room: string;
  password: string;
  professionalLicense: string;
  type: EHealthProfessionalType;
  schedule: IHealthProfessionalSchedule;
  active: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHealthProfessionalSchedule {
  appointmentDuration: number;
  morning?: {
    start: string;
    end: string;
  };
  afternoon?: {
    start: string;
    end: string;
  };
}

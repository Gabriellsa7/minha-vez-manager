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

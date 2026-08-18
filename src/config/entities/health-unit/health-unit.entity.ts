export interface IHealthUnit {
  _id: string;
  userId: string;
  name: string;
  address: IHealthUnitAddress;
  phone: string;
  description?: string;
  services: IService[];
  openingHours: IHealthUnitOpeningHours[];
  email: string;
  img?: string;
  unitType: EHealthUnitType;
  createdAt?: Date;
  updateAt?: Date;
}

export const EHealthUnitType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export type EHealthUnitType =
  (typeof EHealthUnitType)[keyof typeof EHealthUnitType];

export interface IService {
  _id: string;
  name: string;
  description?: string;
  duration?: number;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHealthUnitAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IHealthUnitOpeningHours {
  day: WeekDay;
  open?: string;
  close?: string;
  isClosed: boolean;
}

export const WeekDay = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
} as const;

export type WeekDay = (typeof WeekDay)[keyof typeof WeekDay];

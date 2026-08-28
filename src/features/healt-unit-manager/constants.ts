import {
  CalendarClock,
  Clock,
  FileText,
  FlaskConical,
  Hospital,
  ListChecks,
  Stethoscope,
  UserPlus,
} from 'lucide-react';
import type { SidebarItem } from '../../config/constants/side-bar-manager/side-bar-manager';

export const SIDEBAR_MANAGER_ITEMS: SidebarItem[] = [
  {
    title: 'Unidades de Saude',
    icon: Hospital,
    path: '/',
  },
  {
    title: 'Horário de Funcionamento',
    icon: Clock,
    path: '/health-unit-hours',
  },
  {
    title: 'Profissionais',
    icon: Stethoscope,
    path: '/profissionals',
  },
  {
    title: 'Recepcionistas',
    icon: UserPlus,
    path: '/receptionists',
  },
  {
    title: 'Exames',
    icon: FileText,
    path: '/exam-registration',
  },
  {
    title: 'Exames Disponíveis',
    icon: FlaskConical,
    path: '/exam-offerings',
  },
  {
    title: 'Disponibilidade de Exames',
    icon: CalendarClock,
    path: '/exam-availability',
  },
  {
    title: 'Agenda de Exames',
    icon: ListChecks,
    path: '/exam-bookings',
  },
];

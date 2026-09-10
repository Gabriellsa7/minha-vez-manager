import type { SidebarItem } from '../../config/constants/side-bar-manager/side-bar-manager';
import {
  CalendarPlus,
  CircleUserRound,
  FlaskConical,
  UserRoundCheck,
} from 'lucide-react';

export const SIDEBAR_RECEPTION_ITEMS: SidebarItem[] = [
  {
    title: 'Check-in',
    icon: UserRoundCheck,
    path: '/reception/check-in',
  },
  {
    title: 'Marcar Consulta',
    icon: CalendarPlus,
    path: '/reception/appointments',
  },
  {
    title: 'Marcar Exame',
    icon: FlaskConical,
    path: '/reception/exams',
  },
  {
    title: 'Perfil',
    icon: CircleUserRound,
    path: '/reception/profile',
  },
];

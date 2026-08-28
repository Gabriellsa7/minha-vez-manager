import type { SidebarItem } from '../../config/constants/side-bar-manager/side-bar-manager';
import { CalendarPlus, CircleUserRound, FlaskConical } from 'lucide-react';

export const SIDEBAR_RECEPTION_ITEMS: SidebarItem[] = [
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

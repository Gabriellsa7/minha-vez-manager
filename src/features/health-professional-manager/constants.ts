import type { SidebarItem } from '../../config/constants/side-bar-manager/side-bar-manager';
import {
  CircleUserRound,
  FileText,
  History,
  MonitorCog,
} from 'lucide-react';

export const SIDEBAR_PROFESSIONAL_MANAGER: SidebarItem[] = [
  {
    title: 'Fila Ativa',
    icon: MonitorCog,
    path: '/health-professional-manager',
  },
  {
    title: 'Histórico',
    icon: History,
    path: '/history',
  },
  {
    title: 'Exames',
    icon: FileText,
    path: '/exams',
  },
  {
    title: 'Perfil',
    icon: CircleUserRound,
    path: '/profile',
  },
];

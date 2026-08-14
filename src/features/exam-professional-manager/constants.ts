import type { SidebarItem } from '../../config/constants/side-bar-manager/side-bar-manager';
import { CircleUserRound, History, FlaskConical } from 'lucide-react';

export const SIDEBAR_EXAM_PROFESSIONAL_MANAGER: SidebarItem[] = [
  {
    title: 'Exames',
    icon: FlaskConical,
    path: '/exam-professional',
  },
  {
    title: 'Histórico',
    icon: History,
    path: '/exam-professional/history',
  },
  {
    title: 'Perfil',
    icon: CircleUserRound,
    path: '/profile',
  },
];

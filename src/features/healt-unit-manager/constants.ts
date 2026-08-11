import { FileText, Hospital, Stethoscope } from 'lucide-react';
import type { SidebarItem } from '../../config/constants/side-bar-manager/side-bar-manager';

export const SIDEBAR_MANAGER_ITEMS: SidebarItem[] = [
  {
    title: 'Unidades de Saude',
    icon: Hospital,
    path: '/',
  },
  {
    title: 'Profissionais',
    icon: Stethoscope,
    path: '/profissionals',
  },
  {
    title: 'Exames',
    icon: FileText,
    path: '/exam-registration',
  },
];

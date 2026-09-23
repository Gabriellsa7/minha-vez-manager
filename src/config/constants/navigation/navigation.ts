import {
  CalendarClock,
  CalendarPlus,
  CircleUserRound,
  ClipboardPlus,
  Clock,
  FileText,
  FlaskConical,
  History,
  Hospital,
  ListChecks,
  MonitorCog,
  Stethoscope,
  Upload,
  UserPlus,
  UserRoundCheck,
} from 'lucide-react';
import { HealthProfessionalRole } from '../../entities/auth/auth.entity';
import { healthProfessionalType } from '../../entities/health-profissional/health-professional.entity';
import { UserRole, type IUser } from '../../entities/user/user.entity';
import type { SidebarItem } from '../side-bar-manager/side-bar-manager';

export interface DashboardNavigation {
  title: string;
  items: SidebarItem[];
}

export const ADMIN_NAVIGATION: DashboardNavigation = {
  title: 'Painel Manager',
  items: [
    { title: 'Unidades de Saúde', icon: Hospital, path: '/' },
    {
      title: 'Horário de Funcionamento',
      icon: Clock,
      path: '/health-unit-hours',
    },
    { title: 'Profissionais', icon: Stethoscope, path: '/profissionals' },
    { title: 'Recepcionistas', icon: UserPlus, path: '/receptionists' },
    { title: 'Exames', icon: FileText, path: '/exam-registration' },
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
    { title: 'Agenda de Exames', icon: ListChecks, path: '/exam-bookings' },
  ],
};

export const HEALTH_PROFESSIONAL_NAVIGATION: DashboardNavigation = {
  title: 'Painel de Gestão',
  items: [
    {
      title: 'Fila Ativa',
      icon: MonitorCog,
      path: '/health-professional-manager',
    },
    { title: 'Histórico', icon: History, path: '/history' },
    { title: 'Exames', icon: FileText, path: '/exams' },
    { title: 'Receitas', icon: ClipboardPlus, path: '/prescriptions' },
    { title: 'Perfil', icon: CircleUserRound, path: '/profile' },
  ],
};

export const EXAM_PROFESSIONAL_NAVIGATION: DashboardNavigation = {
  title: 'Painel de Exames',
  items: [
    { title: 'Exames', icon: FlaskConical, path: '/exam-professional' },
    {
      title: 'Enviar resultado',
      icon: Upload,
      path: '/exam-professional/upload-result',
    },
    {
      title: 'Histórico',
      icon: History,
      path: '/exam-professional/history',
    },
    { title: 'Perfil', icon: CircleUserRound, path: '/profile' },
  ],
};

export const RECEPTION_NAVIGATION: DashboardNavigation = {
  title: 'Painel de Recepção',
  items: [
    { title: 'Check-in', icon: UserRoundCheck, path: '/reception/check-in' },
    {
      title: 'Marcar Consulta',
      icon: CalendarPlus,
      path: '/reception/appointments',
    },
    { title: 'Marcar Exame', icon: FlaskConical, path: '/reception/exams' },
    { title: 'Perfil', icon: CircleUserRound, path: '/reception/profile' },
  ],
};

export function resolveNavigation(user?: IUser): DashboardNavigation | null {
  if (!user) return null;

  if (user.principalType === HealthProfessionalRole.RECEPTIONIST) {
    return RECEPTION_NAVIGATION;
  }

  if (user.principalType === HealthProfessionalRole.HEALTH_PROFESSIONAL) {
    return user.healthProfessionalType ===
      healthProfessionalType.EXAM_PROFESSIONAL
      ? EXAM_PROFESSIONAL_NAVIGATION
      : HEALTH_PROFESSIONAL_NAVIGATION;
  }

  if (user.role === UserRole.ADMIN) return ADMIN_NAVIGATION;

  return null;
}

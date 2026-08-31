import { createBrowserRouter } from 'react-router-dom';

import { Auth } from '../features/auth/auth';
import { Login } from '../features/login/login';

import { AppLayout } from '../components/app-layout/app-layout';
import { RouteError } from '../components/error/route-error';
import { NotFound } from '../components/not-found/not-found';

import { AuthenticationOutlet } from './utils/authentication-outlet';
import { AuthorizationOutlet } from './utils/authorization-outlet';

import { HealthUnitManager } from '../features/healt-unit-manager/health-unit-manager';
import { HealthUnitHoursManager } from '../features/health-unit-hours-manager/health-unit-hours-manager';
import { UserRole } from '../config/entities/user/user.entity';
import { HealthProfessionalManager } from '../features/health-professional-manager/health-professional-manager';
import { PrincipalTypeOutlet } from './utils/principal-type-outlet';
import { HealthProfessionalTypeOutlet } from './utils/health-professional-type-outlet';
import { HealthProfessionalRole } from '../config/entities/auth/auth.entity';
import { Professionals } from '../features/profissionals/profissionals';
import { ProfessionalProfile } from '../features/professional-profile/professional-profile';
import { ExamRegistration } from '../features/exam-registration/exam-registration';
import { HealthProfessionalExams } from '../features/health-professional-exams/health-professional-exams';
import { HealthProfessionalHistory } from '../features/health-professional-history/health-professional-history';
import { HealthProfessionalPrescription } from '../features/health-professional-prescription/health-professional-prescription';
import { ExamOfferingManager } from '../features/exam-offering-manager/exam-offering-manager';
import { ExamAvailabilityManager } from '../features/exam-availability-manager/exam-availability-manager';
import { ExamBookingsManager } from '../features/exam-bookings-manager/exam-bookings-manager';
import { ExamProfessionalManager } from '../features/exam-professional-manager/exam-professional-manager';
import { ExamProfessionalHistory } from '../features/exam-professional-history/exam-professional-history';
import { ExamProfessionalUpload } from '../features/exam-professional-upload/exam-professional-upload';
import { Receptionists } from '../features/receptionists/receptionists';
import { ReceptionAppointments } from '../features/reception-appointments/reception-appointments';
import { ReceptionExams } from '../features/reception-exams/reception-exams';
import { ReceptionProfile } from '../features/reception-profile/reception-profile';

export const router = createBrowserRouter([
  {
    element: <Auth />,
    errorElement: <RouteError />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        element: <AuthenticationOutlet />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                element: (
                  <AuthorizationOutlet allowedRoles={[UserRole.ADMIN]} />
                ),
                children: [
                  {
                    path: '/',
                    element: <HealthUnitManager />,
                  },
                  {
                    path: '/health-unit-hours',
                    element: <HealthUnitHoursManager />,
                  },
                  {
                    path: '/profissionals',
                    element: <Professionals />,
                  },
                  {
                    path: '/receptionists',
                    element: <Receptionists />,
                  },
                  {
                    path: '/exam-registration',
                    element: <ExamRegistration />,
                  },
                  {
                    path: '/exam-offerings',
                    element: <ExamOfferingManager />,
                  },
                  {
                    path: '/exam-availability',
                    element: <ExamAvailabilityManager />,
                  },
                  {
                    path: '/exam-bookings',
                    element: <ExamBookingsManager />,
                  },
                ],
              },
              {
                element: (
                  <PrincipalTypeOutlet
                    allowedPrincipalTypes={[
                      HealthProfessionalRole.HEALTH_PROFESSIONAL,
                    ]}
                  />
                ),
                children: [
                  {
                    path: '/profile',
                    element: <ProfessionalProfile />,
                  },
                  {
                    element: (
                      <HealthProfessionalTypeOutlet
                        onlyExamProfessional={false}
                      />
                    ),
                    children: [
                      {
                        path: '/health-professional-manager',
                        element: <HealthProfessionalManager />,
                      },
                      {
                        path: '/history',
                        element: <HealthProfessionalHistory />,
                      },
                      {
                        path: '/exams',
                        element: <HealthProfessionalExams />,
                      },
                      {
                        path: '/prescriptions',
                        element: <HealthProfessionalPrescription />,
                      },
                    ],
                  },
                  {
                    element: (
                      <HealthProfessionalTypeOutlet
                        onlyExamProfessional={true}
                      />
                    ),
                    children: [
                      {
                        path: '/exam-professional',
                        element: <ExamProfessionalManager />,
                      },
                      {
                        path: '/exam-professional/upload-result',
                        element: <ExamProfessionalUpload />,
                      },
                      {
                        path: '/exam-professional/history',
                        element: <ExamProfessionalHistory />,
                      },
                    ],
                  },
                ],
              },
              {
                element: (
                  <PrincipalTypeOutlet
                    allowedPrincipalTypes={[
                      HealthProfessionalRole.RECEPTIONIST,
                    ]}
                  />
                ),
                children: [
                  {
                    path: '/reception/appointments',
                    element: <ReceptionAppointments />,
                  },
                  {
                    path: '/reception/exams',
                    element: <ReceptionExams />,
                  },
                  {
                    path: '/reception/profile',
                    element: <ReceptionProfile />,
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

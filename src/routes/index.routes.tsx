import { createBrowserRouter } from 'react-router-dom';

import { Auth } from '../features/auth/auth';
import { Login } from '../features/login/login';

import { AppLayout } from '../components/app-layout/app-layout';
import { RouteError } from '../components/error/route-error';
import { NotFound } from '../components/not-found/not-found';

import { AuthenticationOutlet } from './utils/authentication-outlet';
import { AuthorizationOutlet } from './utils/authorization-outlet';

import { HealthUnitManager } from '../features/healt-unit-manager/health-unit-manager';
import { UserRole } from '../config/entities/user/user.entity';
import { HealthProfessionalManager } from '../features/health-professional-manager/health-professional-manager';
import { PrincipalTypeOutlet } from './utils/principal-type-outlet';
import { HealthProfessionalRole } from '../config/entities/auth/auth.entity';

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
                    path: '/health-professional-manager',
                    element: <HealthProfessionalManager />,
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

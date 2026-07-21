import { createBrowserRouter } from 'react-router-dom';
import { Auth } from '../features/auth/auth';
import { RouteError } from '../components/error/route-error';
import { AuthenticationOutlet } from './utils/authentication-outlet';
import { AppLayout } from '../components/app-layout/app-layout';
import { Login } from '../features/login/login';
import { HealthUnitManager } from '../features/healt-unit-manager/health-unit-manager';
import { NotFound } from '../components/not-found/not-found';

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
                path: '/',
                element: <HealthUnitManager />,
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

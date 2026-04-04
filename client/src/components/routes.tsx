import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GoalsPage } from '../pages/goals/goals-page';
import { HomePage } from '../pages/home-page';
import { Contacts } from './contacts/contacts';
import { Equipment } from './equipment/equipment';
import { Publications } from './publications';
import { Structure } from './structure';
import { Layout } from './ui/layout/layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/goals',
        element: <GoalsPage />,
      },
      {
        path: '/structure',
        element: <Structure />,
      },
      {
        path: '/equipment',
        element: <Equipment />,
      },
      {
        path: '/developments',
        element: <div>Разработки</div>,
      },
      {
        path: '/publications',
        element: <Publications />,
      },
      {
        path: '/contacts',
        element: <Contacts />,
      },
      {
        path: '/login',
        element: <div>Вход</div>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

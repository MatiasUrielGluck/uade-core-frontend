import { Navigate } from 'react-router-dom';
import MainLayout from "../layouts/MainLayout.tsx";
import MyQueuesPage from "../pages/MyQueuesPage.tsx";
import MySubscriptionsPage from "../pages/MySubscriptionsPage.tsx";
import DashboardPage from '../pages/DashboardPage.tsx';
import HealthPage from '../pages/HealthPage.tsx';
import SearchPage from '../pages/SearchPage.tsx';
import ReplayPage from '../pages/ReplayPage.tsx';

export default [
  {
    path: '/signup',
    element: <></>,
  },
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace/>,
      },
      {
        path: 'dashboard',
        element: <DashboardPage/>,
      },
      {
        path: 'my-queues',
        element: <MyQueuesPage/>,
      },
      {
        path: 'my-subscriptions',
        element: <MySubscriptionsPage/>,
      },
      {
        path: 'search',
        element: <SearchPage/>,
      },
      {
        path: 'replay',
        element: <ReplayPage/>,
      },
      {
        path: 'health',
        element: <HealthPage/>,
      },
    ],
  },
  {
    path: '*',
    element: <></>,
  },
];
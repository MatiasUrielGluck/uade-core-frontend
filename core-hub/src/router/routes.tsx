import { Navigate } from 'react-router-dom';
import MainLayout from "../layouts/MainLayout.tsx";
import MyQueuesPage from "../pages/MyQueuesPage.tsx";

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
        element: <><h1>Dashboard</h1></>,
      },
      {
        path: 'my-queues',
        element: <MyQueuesPage/>,
      },
      {
        path: 'search',
        element: <><h1>Search</h1></>,
      },
      {
        path: 'replay',
        element: <><h1>Replay</h1></>,
      },
      {
        path: 'health',
        element: <><h1>Health</h1></>,
      },
    ],
  },
  {
    path: '*',
    element: <></>,
  },
];
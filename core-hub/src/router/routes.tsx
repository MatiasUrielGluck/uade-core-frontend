import { Navigate } from 'react-router-dom';

export default [
  {
    path: '/',
    element: <Navigate to="/"></Navigate>,
  },
  {
    path: '/login',
    element: <></>,
  },
  {
    path: '/signup',
    element: <></>,
  },
  {
    path: '/dashboard',
    element: (
      <>
        <></>
      </>
    ),
  },
  {
    path: '/my-queues',
    element: (
      <>
        <></>
      </>
    ),
  },
  {
    path: '/search',
    element: (
      <>
        <></>
      </>
    ),
  },
  {
    path: '/replay',
    element: (
      <>
        <></>
      </>
    ),
  },
  {
    path: '/health',
    element: (
      <>
        <></>
      </>
    ),
  },
];
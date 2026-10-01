import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Medicines = lazy(() => import('@/pages/Medicines'));
const AiAssistant = lazy(() => import('@/pages/AiAssistant'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const Alerts = lazy(() => import('@/pages/Alerts'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'medicines', element: <Medicines /> },
      { path: 'ai', element: <AiAssistant /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'alerts', element: <Alerts /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
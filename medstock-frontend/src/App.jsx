import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Medicines = lazy(() => import('@/pages/Medicines'));
const AiAssistant = lazy(() => import('@/pages/AiAssistant'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const Alerts = lazy(() => import('@/pages/Alerts'));
const Landing = lazy(() => import('@/pages/Landing'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Pharmacy = lazy(() => import('@/pages/Pharmacy'));
const About = lazy(() => import('@/pages/About'));
const DoseTracker = lazy(() => import('@/pages/DoseTracker'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ActivitySecurity = lazy(() => import('@/pages/ActivitySecurity'));

const router = createBrowserRouter([
  { path: '/restok', element: <Suspense fallback={null}><Landing /></Suspense> },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'medicines', element: <Medicines /> },
      { path: 'ai', element: <AiAssistant /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'pharmacy', element: <Pharmacy /> },
      { path: 'about', element: <About /> },
      { path: 'dose-tracker', element: <DoseTracker /> },
      { path: '*', element: <NotFound /> },
      { path: 'activity-security', element: <ActivitySecurity /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
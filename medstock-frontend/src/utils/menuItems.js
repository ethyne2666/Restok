import {
  Activity,
  Globe,
  HeartPulse,
  Pill,
  Shield,
  ShoppingCart,
} from 'lucide-react';
import { navItems } from '@/utils/navItems';

export const appMenuSections = [
  { title: 'Main', items: navItems },
  {
    title: 'Explore',
    items: [
      { to: '/analytics', label: 'Tablet analytics', icon: Activity },
      { to: '/activity-security', label: 'User Activity & Security', icon: Shield },
      { to: '/pharmacy', label: 'Pharmacy counter', icon: ShoppingCart },
      { to: '/dose-tracker', label: 'Daily dose tracker', icon: Pill },
      { to: '/about', label: 'About us', icon: HeartPulse },
      { to: '/restok', label: 'Landing page', icon: Globe },
    ],
  },
];
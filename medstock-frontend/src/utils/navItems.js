import { Bell, Boxes, History, LayoutDashboard, Sparkles } from 'lucide-react';

export const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/medicines', label: 'Stock', icon: Boxes },
  { to: '/ai', label: 'AI Update', icon: Sparkles },
  { to: '/transactions', label: 'History', icon: History },
  { to: '/alerts', label: 'Alerts', icon: Bell },
];
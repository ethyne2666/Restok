import { Activity, Globe, HeartPulse, Pill, ShoppingCart } from "lucide-react";
import { navItems } from "@/utils/navItems";

// Everything listed here shows up in the mobile hamburger menu.
// To add a new feature later, just add one line to a section below.
export const appMenuSections = [
  { title: "Main", items: navItems },
  {
    title: "Explore",
    items: [
      { to: "/analytics", label: "Tablet analytics", icon: Activity },
      { to: "/pharmacy", label: "Pharmacy counter", icon: ShoppingCart },
      { to: "/dose-tracker", label: "Daily dose tracker", icon: Pill },
      { to: "/about", label: "About us", icon: HeartPulse },
      { to: "/restok", label: "Landing page", icon: Globe },
    ],
  },
];
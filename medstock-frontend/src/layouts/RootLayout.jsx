import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SideNav } from "@/components/SideNav";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { PageState } from "@/components/PageState";
import { FloatingIcons } from "@/components/decor/FloatingIcons";
import { Footer } from "@/components/Footer";
import { ActivityTracker } from '@/components/ActivityTracker';

export function RootLayout() {
  return (
    <div className="relative min-h-screen">
      <div aria-hidden="true" className="rs-grid rs-grid-fade fixed inset-0" />
      <div className="fixed inset-0 md:pl-60">
        <FloatingIcons />
      </div>

      <SideNav />
      <div className="relative md:pl-60">
        <MobileHeader />
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:px-8 md:pb-8 md:pt-8">
          <Suspense fallback={<PageState isLoading />}>
            <Outlet />
          </Suspense>
        </main>
        {/* footer is for tablets and desktops only */}
        <Footer className="hidden md:block" />
      </div>
      <BottomNav />
    </div>
  );
}
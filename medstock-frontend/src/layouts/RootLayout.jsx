import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from '@/components/SideNav';
import { BottomNav } from '@/components/BottomNav';
import { BrandLogo } from '@/components/BrandLogo';
import { PageState } from '@/components/PageState';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SideNav />
      <div className="md:pl-60">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
          <BrandLogo />
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">
          <Suspense fallback={<PageState isLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
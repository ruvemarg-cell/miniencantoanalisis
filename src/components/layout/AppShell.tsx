'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PriceComparisonModal } from './PriceComparisonModal';

function MainLayoutShell({ children }: { children: React.ReactNode }) {
  const { theme } = useApp();

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#06080e] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      {/* Global Price Comparison Modal */}
      <PriceComparisonModal />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <MainLayoutShell>{children}</MainLayoutShell>
    </AppProvider>
  );
}

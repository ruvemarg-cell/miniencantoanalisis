'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PeriodType, Product } from '@/types';
import { mockWeeklyProducts, mockMonthlyProducts } from '@/data/mockProducts';

interface AppContextType {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  periodLabel: string;
  periodDateRange: string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeProductIds: Set<string>;
  toggleProductActive: (id: string) => void;
  isProductActive: (id: string) => boolean;
  resetProductSelection: () => void;
  comparisonProduct: Product | null;
  openComparison: (product: Product) => void;
  closeComparison: () => void;
  currentProducts: Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState<PeriodType>('semanal');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeProductIds, setActiveProductIds] = useState<Set<string>>(new Set());
  const [comparisonProduct, setComparisonProduct] = useState<Product | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    setIsClient(true);
    // Theme
    const savedTheme = localStorage.getItem('miniencanto_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // Sidebar
    const savedSidebar = localStorage.getItem('miniencanto_sidebar_collapsed');
    if (savedSidebar !== null) {
      setSidebarCollapsed(savedSidebar === 'true');
    }

    // Product active selection
    const savedActiveIds = localStorage.getItem('miniencanto_active_products');
    if (savedActiveIds) {
      try {
        const parsed = JSON.parse(savedActiveIds);
        setActiveProductIds(new Set(parsed));
      } catch {
        // initialize all active
        const allIds = mockWeeklyProducts.map((p) => p.id);
        setActiveProductIds(new Set(allIds));
      }
    } else {
      // Default: all 30 products are active
      const allIds = mockWeeklyProducts.map((p) => p.id);
      setActiveProductIds(new Set(allIds));
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('miniencanto_theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('miniencanto_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleProductActive = (id: string) => {
    setActiveProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem('miniencanto_active_products', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const isProductActive = (id: string) => {
    // If not yet loaded or client rendered, default true
    if (activeProductIds.size === 0 && !isClient) return true;
    return activeProductIds.has(id);
  };

  const resetProductSelection = () => {
    const allIds = mockWeeklyProducts.map((p) => p.id);
    const newSet = new Set(allIds);
    setActiveProductIds(newSet);
    localStorage.setItem('miniencanto_active_products', JSON.stringify(allIds));
  };

  const openComparison = (product: Product) => {
    setComparisonProduct(product);
  };

  const closeComparison = () => {
    setComparisonProduct(null);
  };

  const currentProducts = period === 'semanal' ? mockWeeklyProducts : mockMonthlyProducts;

  const periodLabel = period === 'semanal' ? 'Semanal (Últimos 7 días)' : 'Mensual (Últimos 30 días)';
  const periodDateRange =
    period === 'semanal'
      ? '19/10/2026 - 26/10/2026'
      : '26/09/2026 - 26/10/2026';

  return (
    <AppContext.Provider
      value={{
        period,
        setPeriod,
        periodLabel,
        periodDateRange,
        theme,
        toggleTheme,
        sidebarCollapsed,
        toggleSidebar,
        activeProductIds,
        toggleProductActive,
        isProductActive,
        resetProductSelection,
        comparisonProduct,
        openComparison,
        closeComparison,
        currentProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

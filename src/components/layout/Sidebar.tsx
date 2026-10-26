'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Package,
  Layers,
  Calendar,
  BarChart3,
  Calculator,
  Info,
  Archive,
  Menu,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Productos', href: '/productos', icon: Package },
  { name: 'Categorías', href: '/categorias', icon: Layers },
  { name: 'Fechas importantes', href: '/fechas-importantes', icon: Calendar },
  { name: 'Estadísticas', href: '/estadisticas', icon: BarChart3 },
  { name: 'Calculadora con comparador de precios', href: '/calculadora', icon: Calculator },
  { name: 'Info', href: '/info', icon: Info },
  { name: 'Archivo mensual', href: '/archivo-mensual', icon: Archive },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, theme } = useApp();

  return (
    <aside
      className={`relative z-30 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } ${
        theme === 'dark'
          ? 'bg-[#05070c] text-white border-r border-slate-800/80 shadow-[4px_0_24px_rgba(0,0,0,0.6)]'
          : 'bg-white text-slate-800 border-r border-slate-200 shadow-sm'
      }`}
      style={{
        backgroundImage:
          theme === 'dark'
            ? 'radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.04) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.03) 0%, transparent 40%)'
            : undefined,
      }}
    >
      {/* Top Header / Logo + Toggle */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-white/10 p-1 flex items-center justify-center border border-cyan-400/30">
            <Image
              src="/logo-miniencanto.webp"
              alt="MiniEncanto Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent truncate">
                MiniEncanto
              </span>
              <span className="text-[11px] font-medium tracking-wider uppercase text-cyan-400/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3 inline text-cyan-400" /> Análisis Argentina
              </span>
            </div>
          )}
        </div>

        {/* 3-line Toggle Button */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expandir barra lateral' : 'Retraer barra lateral'}
          className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
            theme === 'dark'
              ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title={sidebarCollapsed ? 'Expandir barra lateral' : 'Retraer barra lateral'}
        >
          {sidebarCollapsed ? <Menu className="w-5 h-5 text-cyan-400" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border-l-4 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                    : 'bg-cyan-50 text-cyan-800 border-l-4 border-cyan-500 font-semibold shadow-sm'
                  : theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? 'text-cyan-400'
                    : theme === 'dark'
                    ? 'text-slate-400 group-hover:text-cyan-300'
                    : 'text-slate-500 group-hover:text-cyan-600'
                }`}
              />
              {!sidebarCollapsed && (
                <span className="truncate tracking-normal text-left">{item.name}</span>
              )}
              {sidebarCollapsed && (
                <span className="sr-only">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer / Market context */}
      <div className="p-3 border-t border-slate-800/50">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl ${
            theme === 'dark' ? 'bg-slate-900/60 border border-slate-800' : 'bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {!sidebarCollapsed && (
            <div className="text-xs truncate">
              <p className="font-semibold text-slate-200 dark:text-slate-200">Mercado Argentina</p>
              <p className="text-[10px] text-slate-400">MLA / ARS / ART</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

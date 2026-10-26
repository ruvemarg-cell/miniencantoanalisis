'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, CalendarDays, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AutomationStatusModal } from './AutomationStatusModal';

export function Header() {
  const pathname = usePathname();
  const {
    period,
    setPeriod,
    periodDateRange,
    theme,
    toggleTheme,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);

  // The global header with period selector is visible in ALL pages EXCEPT Info (/info)
  const isInfoPage = pathname === '/info';

  if (isInfoPage) {
    return (
      <>
        <header
          className={`w-full h-20 px-6 flex items-center justify-between transition-colors z-20 ${
            theme === 'dark'
              ? 'bg-white text-slate-900 border-b-2 border-cyan-400 shadow-[0_4px_25px_rgba(34,211,238,0.25)]'
              : 'bg-white text-slate-900 border-b border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-8 bg-cyan-500 rounded-full" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Panel Económico e Indicadores de Mercado
              </h1>
              <p className="text-xs text-slate-500">
                Datos macroeconómicos oficiales de Argentina (BCRA / INDEC) y cotizaciones en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all shadow-sm cursor-pointer"
              title="Ver estado de automatizaciones y APIs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Estado Sistema</span>
            </button>

            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all shadow-sm cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span>Modo Oscuro</span>
                </>
              )}
            </button>
          </div>
        </header>
        <AutomationStatusModal isOpen={modalOpen} onClose={() => setModalOpen(false)} theme={theme} />
      </>
    );
  }

  return (
    <>
      <header
        className={`w-full min-h-[5rem] px-6 py-3 flex flex-wrap items-center justify-between gap-4 transition-all z-20 ${
          theme === 'dark'
            ? 'bg-white text-slate-900 border-b-2 border-cyan-400 shadow-[0_4px_25px_rgba(34,211,238,0.25)]'
            : 'bg-white text-slate-900 border-b border-slate-200 shadow-sm'
        }`}
      >
        {/* Title / Context info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2.5 h-8 bg-cyan-500 rounded-full shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                Argentina
              </span>
              <button
                onClick={() => setModalOpen(true)}
                className="text-xs text-slate-600 hover:text-cyan-700 flex items-center gap-1 font-semibold group cursor-pointer transition-colors"
                title="Hacé clic para ver el estado de la automatización y forzar una actualización"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-dotted underline-offset-2">Auto-actualizado: Lun 05:00 ART</span>
              </button>
            </div>
            <div className="text-xs font-medium text-slate-600 mt-0.5">
              Rango activo: <strong className="text-cyan-700 font-bold">{periodDateRange}</strong>
            </div>
          </div>
        </div>

        {/* Global Period Selector & Theme Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Selector Tabs */}
          <div
            role="radiogroup"
            aria-label="Selector de período de análisis"
            className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner"
          >
            <button
              role="radio"
              aria-checked={period === 'semanal'}
              onClick={() => setPeriod('semanal')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === 'semanal'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Semanal (7 días)</span>
            </button>

            <button
              role="radio"
              aria-checked={period === 'mensual'}
              onClick={() => setPeriod('mensual')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === 'mensual'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Mensual (30 días)</span>
            </button>
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all shadow-sm cursor-pointer"
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">Oscuro</span>
              </>
            )}
          </button>
        </div>
      </header>

      <AutomationStatusModal isOpen={modalOpen} onClose={() => setModalOpen(false)} theme={theme} />
    </>
  );
}

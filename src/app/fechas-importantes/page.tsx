'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Store,
  ChevronRight,
  Info,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockCommercialEvents } from '@/data/commercialDates';
import { formatARS, formatNumberAR, getCountdownParts } from '@/lib/formatters';
import { Product } from '@/types';

export default function FechasImportantesPage() {
  const { currentProducts, periodLabel, theme, openComparison } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string>(mockCommercialEvents[0].id);
  const [countdowns, setCountdowns] = useState<Record<string, ReturnType<typeof getCountdownParts>>>({});

  // Real-time ticker for all events
  useEffect(() => {
    const updateAll = () => {
      const nextMap: Record<string, ReturnType<typeof getCountdownParts>> = {};
      for (const ev of mockCommercialEvents) {
        nextMap[ev.id] = getCountdownParts(ev.targetDate);
      }
      setCountdowns(nextMap);
    };

    updateAll();
    const timer = setInterval(updateAll, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeEvent =
    mockCommercialEvents.find((e) => e.id === selectedEventId) || mockCommercialEvents[0];

  // Resolve recommended products from current active period products
  const recommendedProducts: { product: Product; explanation: string }[] = React.useMemo(() => {
    return activeEvent.recommendedProductIds
      .map((id) => {
        const prod = currentProducts.find((p) => p.id === id);
        if (!prod) return null;
        let explanation = '';
        if (activeEvent.name.includes('CyberMonday') || activeEvent.name.includes('Black Friday')) {
          explanation = `Alta tasa de conversión histórica (+${prod.trendPercentage}% de crecimiento) y elasticidad de precio ideal para descuentos agresivos.`;
        } else if (activeEvent.name.includes('Navidad') || activeEvent.name.includes('Reyes')) {
          explanation = `Excelente ticket promedio para regalo familiar (${formatARS(
            prod.referencePriceARS
          )}) con bajo índice de devoluciones.`;
        } else if (activeEvent.name.includes('Verano')) {
          explanation = `Pico estacional directo por hábitos de viaje y recreación al aire libre con ventas sostenidas.`;
        } else {
          explanation = `Demanda comprobada en el rubro ${prod.category} con volumen continuo de búsquedas orgánicas en Argentina.`;
        }
        return { product: prod, explanation };
      })
      .filter(Boolean) as { product: Product; explanation: string }[];
  }, [activeEvent, currentProducts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Calendario Comercial y Oportunidades Estacionales en Argentina</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100 dark:text-white">
          Fechas Importantes del Comercio Electrónico
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Temporadas pico, CyberMonday, Black Friday y festividades clave. Los contadores en tiempo real avanzan con la hora local de Argentina, y las recomendaciones vinculadas actualizan sus ventas según el período activo (<strong>{periodLabel}</strong>).
        </p>
      </div>

      {/* Grid of Commercial Events with Real-Time Timers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockCommercialEvents.map((ev) => {
          const cd = countdowns[ev.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
          const isSelected = ev.id === selectedEventId;

          return (
            <div
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 bg-[#0c1424] shadow-lg'
                  : theme === 'dark'
                  ? 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-cyan-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black ${
                      ev.importance === 'Crítica'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : ev.importance === 'Alta'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    Prioridad {ev.importance}
                  </span>
                  <span className="text-slate-400 font-medium">{ev.dateStr}</span>
                </div>

                <h3 className="font-bold text-base text-slate-100 dark:text-white leading-snug mb-1">
                  {ev.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              {/* Countdown clock boxes */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="block text-lg font-black text-cyan-400">{cd.days}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Días</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="block text-lg font-black text-cyan-400">{cd.hours}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Horas</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="block text-lg font-black text-cyan-400">{cd.minutes}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Min</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="block text-lg font-black text-cyan-400">{cd.seconds}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Seg</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEventId(ev.id);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Ver productos recomendados</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Products Panel for the Selected Event */}
      <div
        className={`p-6 rounded-2xl border space-y-6 ${
          theme === 'dark'
            ? 'bg-[#080c14] border-cyan-500/30 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-black text-slate-100 dark:text-white">
                Productos Recomendados para {activeEvent.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Impacto histórico esperado: <strong className="text-cyan-400">{activeEvent.historicalSalesImpact}</strong>
            </p>
          </div>

          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 self-start sm:self-auto">
            {recommendedProducts.length} recomendaciones respaldadas
          </span>
        </div>

        {recommendedProducts.length >= 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedProducts.map(({ product, explanation }) => (
              <div
                key={product.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  theme === 'dark'
                    ? 'bg-[#0b101b] border-slate-800 hover:border-cyan-500/40'
                    : 'bg-slate-50 border-slate-200 hover:border-cyan-400 shadow-sm'
                }`}
              >
                <div>
                  <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-2 left-2 bg-cyan-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                      Top #{product.rank}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-100 dark:text-white line-clamp-2 mb-2">
                    {product.name}
                  </h3>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-amber-400 text-[11px] block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Fundamento Comercial:
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {explanation}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Precio ARS</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {formatARS(product.referencePriceARS)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Ventas del Período</span>
                      <span className="font-extrabold text-slate-200 text-sm">
                        {formatNumberAR(product.unitsSold)} u.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openComparison(product)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Comparar precios</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-amber-400" />
            <p className="text-sm font-semibold text-slate-200">
              Menos de 3 recomendaciones respaldadas para esta fecha.
            </p>
            <p className="text-xs max-w-md mx-auto">
              Solo se presentan recomendaciones con datos observados de demanda en Argentina. No se agregan productos forzados sin respaldo de métricas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

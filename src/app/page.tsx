'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  Package,
  Layers,
  Calendar,
  BarChart3,
  Calculator,
  Info,
  Archive,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatARS, formatCompactARS, formatNumberAR, getCountdownParts } from '@/lib/formatters';
import { mockCommercialEvents } from '@/data/commercialDates';

export default function HomePage() {
  const { currentProducts, period, periodLabel, periodDateRange, theme, openComparison } = useApp();
  const nextEvent = mockCommercialEvents[0]; // CyberMonday 2026
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      setCountdown(getCountdownParts(nextEvent.targetDate));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextEvent.targetDate]);

  // Aggregate stats from current period
  const top10 = currentProducts.slice(0, 10);
  const totalTop10Units = top10.reduce((acc, p) => acc + p.unitsSold, 0);
  const totalTop10Revenue = top10.reduce((acc, p) => acc + p.estimatedRevenueARS, 0);

  return (
    <div className="space-y-8">
      {/* Hero Banner with MiniEncanto brand spirit */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#0c1424] via-[#09101d] to-[#05070c] border-cyan-500/30'
            : 'bg-gradient-to-br from-cyan-50 via-sky-50 to-white border-cyan-200'
        }`}
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma de Inteligencia Comercial para Argentina</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Análisis y Tendencias de E-commerce{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                MiniEncanto
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Monitoreo continuo de los 30 productos con mayor volumen y demanda en Argentina,
              comparador de precios multitienda (Mercado Libre, Amazon, AliExpress) y calculadora de costos y rentabilidad real en pesos argentinos.
            </p>
          </div>

          {/* Real-time countdown to next Argentine commercial event */}
          <div
            className={`p-5 rounded-2xl border w-full sm:w-auto shrink-0 shadow-lg ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>Próximo Gran Evento Comercial en AR</span>
            </div>
            <p className="text-sm font-black text-slate-100 dark:text-white truncate">
              {nextEvent.name}
            </p>
            <p className="text-xs text-slate-400 mb-3">{nextEvent.dateStr}</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="block text-xl font-black text-cyan-400">{countdown.days}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Días</span>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="block text-xl font-black text-cyan-400">{countdown.hours}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Hs</span>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="block text-xl font-black text-cyan-400">{countdown.minutes}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Min</span>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="block text-xl font-black text-cyan-400">{countdown.seconds}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Seg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global summary indicator cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Top 1 Trend */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#0b101a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Producto #1 en Tendencia</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Puesto 1
            </span>
          </div>
          <p className="text-base font-bold truncate text-slate-100 dark:text-white">
            {currentProducts[0]?.name}
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Precio ref:</span>
            <span className="text-lg font-black text-emerald-400">
              {formatARS(currentProducts[0]?.referencePriceARS)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{currentProducts[0]?.trendPercentage}% vs período comparable</span>
          </div>
        </div>

        {/* Card 2: Units Sold Top 10 */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#0b101a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Unidades Top 10 ({period === 'semanal' ? '7 Días' : '30 Días'})</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-white">
            {formatNumberAR(totalTop10Units)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Calculado para los 10 productos líderes del período
          </p>
        </div>

        {/* Card 3: Estimated Money Top 10 */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#0b101a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Facturación Estimada Top 10</span>
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              Estimación
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-cyan-400">
            {formatCompactARS(totalTop10Revenue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            ≈ {formatARS(totalTop10Revenue)}
          </p>
        </div>

        {/* Card 4: Scheduled Automation Status */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#0b101a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Automatización Semanal</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-slate-100 dark:text-white">Activa y Programada</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Lunes 05:00 a. m. ART (America/Argentina/Buenos_Aires).
          </p>
          <span className="inline-block mt-2 text-[10px] text-cyan-400 font-semibold">
            {periodDateRange}
          </span>
        </div>
      </div>

      {/* Featured Top 3 Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Podio de Productos Más Vendidos ({periodLabel})
            </h2>
            <p className="text-xs text-slate-400">
              Selección de los tres artículos con mayor rotación en el mercado argentino
            </p>
          </div>
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Ver ranking completo de los 30 productos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentProducts.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all group hover:scale-[1.01] ${
                theme === 'dark'
                  ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50 shadow-lg'
                  : 'bg-white border-slate-200 hover:border-cyan-400 shadow-md'
              }`}
            >
              <div>
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-slate-950 border border-slate-800">
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-cyan-600/90 text-white font-black text-xs px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                    Top #{prod.rank}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                    +{prod.trendPercentage}%
                  </div>
                </div>

                <div className="text-xs font-semibold text-cyan-400 mb-1">
                  {prod.category} • <span className="capitalize">{prod.presentation}</span>
                </div>
                <h3 className="font-bold text-sm leading-snug line-clamp-2 text-slate-100 dark:text-white">
                  {prod.name}
                </h3>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Precio Ref. ARS</span>
                    <span className="text-base font-black text-emerald-400">
                      {formatARS(prod.referencePriceARS)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Unidades</span>
                    <span className="text-base font-black text-slate-200">
                      {formatNumberAR(prod.unitsSold)} u.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openComparison(prod)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-sm"
                >
                  <span>Comparar precios en tiendas</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of All Application Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Módulos y Herramientas de Análisis
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/productos"
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] group ${
              theme === 'dark'
                ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100 dark:text-white mb-1">
              Catálogo Top 30
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explora los 30 productos con mayor volumen, filtra por rango de precio, presentación, peso, color y activa/descarta artículos en tu selección.
            </p>
          </Link>

          <Link
            href="/categorias"
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] group ${
              theme === 'dark'
                ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400 mb-3 border border-sky-500/20 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100 dark:text-white mb-1">
              Categorías y Estacionalidad
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curvas de estacionalidad anual (Ene-Dic) y análisis de concentración de ventas por rangos de precio en cada rubro.
            </p>
          </Link>

          <Link
            href="/fechas-importantes"
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] group ${
              theme === 'dark'
                ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100 dark:text-white mb-1">
              Calendario Comercial AR
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CyberMonday, Hot Sale, Navidad y fechas patrias o comerciales con cuenta regresiva en vivo y recomendaciones respaldadas.
            </p>
          </Link>

          <Link
            href="/estadisticas"
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] group ${
              theme === 'dark'
                ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-3 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100 dark:text-white mb-1">
              Estadísticas Globales
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gráficas interactivas de ventas mensuales, rankings por categoría, concentración de tickets y comparación interanual (YoY).
            </p>
          </Link>

          <Link
            href="/calculadora"
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] group ${
              theme === 'dark'
                ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100 dark:text-white mb-1">
              Calculadora Ecom y Comparador
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulador de comisiones ML (Clásica/Premium), envíos, IIBB, publicidad y rentabilidad neta real vinculada a los 30 productos.
            </p>
          </Link>

          <Link
            href="/info"
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] group ${
              theme === 'dark'
                ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-3 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100 dark:text-white mb-1">
              Información Macroeconómica
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cotización en vivo del Dólar Oficial, Blue y Tarjeta, último índice de inflación INDEC y volumen estimado de Mercado Libre.
            </p>
          </Link>

          <Link
            href="/archivo-mensual"
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] group ${
              theme === 'dark'
                ? 'bg-[#0b101a] border-slate-800 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
            }`}
          >
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Archive className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100 dark:text-white mb-1">
              Archivo Mensual Histórico
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consulta auditorías de meses cerrados (Septiembre, Agosto, Julio) con sus dos gráficas canónicas y métricas intactas.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

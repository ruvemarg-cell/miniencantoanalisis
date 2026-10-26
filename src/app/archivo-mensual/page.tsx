'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Archive,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Package,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Store,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { mockMonthlyArchives } from '@/data/monthlyArchives';
import { formatARS, formatNumberAR, formatDateAR } from '@/lib/formatters';

export default function ArchivoMensualPage() {
  const { theme, openComparison } = useApp();
  const [selectedMonthId, setSelectedMonthId] = useState<string>(mockMonthlyArchives[0].monthId);

  const selectedArchive =
    mockMonthlyArchives.find((m) => m.monthId === selectedMonthId) || mockMonthlyArchives[0];

  // Chart 1 Data: Top selling products of the month (Top 8 for readable bar chart)
  const topProductsChartData = selectedArchive.topProducts.slice(0, 8).map((p) => ({
    name: p.name.length > 25 ? p.name.slice(0, 25) + '...' : p.name,
    fullName: p.name,
    unitsSold: p.unitsSold,
    rank: p.rank,
  }));

  // Chart 2 Data: Categories from most sold to least sold
  const topCategoriesChartData = selectedArchive.topCategories;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Archive className="w-4 h-4" />
          <span>Auditoría Histórica de Períodos Cerrados</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100 dark:text-white">
          Archivo Mensual de Análisis
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Histórico congelado de meses anteriores. Al finalizar cada mes calendario y completarse la auditoría de cancelaciones y despachos (día 1 del mes siguiente a las 05:00 ART), se genera una copia inmutable sin sustitución por datos posteriores.
        </p>
      </div>

      {/* Month Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {mockMonthlyArchives.map((m) => {
          const isSelected = m.monthId === selectedMonthId;
          return (
            <button
              key={m.monthId}
              onClick={() => setSelectedMonthId(m.monthId)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.02]'
                  : theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{m.monthName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Cerrado
              </span>
            </button>
          );
        })}

        {/* Current Month Placeholder (Not closed yet) */}
        <div
          title="El mes en curso se archivará al concluir el 31 de Octubre a las 23:59 ART"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap border border-dashed border-slate-800 text-slate-500 bg-slate-950/40 cursor-not-allowed"
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Octubre 2026 (En curso - Cierra 31/10)</span>
        </div>
      </div>

      {/* Selected Month Metadata Banner */}
      <div
        className={`p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-slate-100 dark:text-white">
                Análisis de {selectedArchive.monthName}
              </h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Copia Histórica Inmutable
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {selectedArchive.methodologyNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Fecha de Cierre</span>
              <span className="font-bold text-slate-200">{selectedArchive.closedDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Guardado / Congelado</span>
              <span className="font-bold text-cyan-400">{formatDateAR(selectedArchive.archivedAt)}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <span><strong>Fuente de auditoría:</strong> {selectedArchive.dataSource}</span>
          <span><strong>Total de artículos auditados:</strong> {selectedArchive.productsCount} productos</span>
        </div>
      </div>

      {/* STRICTLY TWO CHARTS (User requirement: Only two charts on this page) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica 1: Productos más vendidos del mes */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-100 dark:text-white">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              1. Productos Más Vendidos del Mes ({selectedArchive.monthName})
            </h3>
            <p className="text-xs text-slate-400">
              Unidades consolidadas vendidas por los productos líderes durante el mes cerrado.
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#06b6d4',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, _, item: any) => [
                    `${formatNumberAR(val)} u. (Puesto #${item.payload.rank})`,
                    item.payload.fullName,
                  ]}
                />
                <Bar dataKey="unitsSold" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica 2: Categorías desde la más vendida hasta la menos vendida del mes */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-100 dark:text-white">
              <Layers className="w-5 h-5 text-indigo-400" />
              2. Categorías de la Más Vendida a la Menos Vendida ({selectedArchive.monthName})
            </h3>
            <p className="text-xs text-slate-400">
              Volumen total de unidades despachadas agrupadas por rubro en Argentina.
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCategoriesChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#6366f1',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${formatNumberAR(val)} unidades`, 'Ventas Totales']}
                />
                <Bar dataKey="unitsSold" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 30 Products Table/Cards (Ordered 1 to 30 from original monthly ranking) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100 dark:text-white">
            <Package className="w-5 h-5 text-cyan-400" />
            Los 30 Productos del Mes (Ordenados del Puesto 1 al 30)
          </h3>
          <p className="text-xs text-slate-400">
            Registro histórico inalterado correspondiente al cierre definitivo de {selectedArchive.monthName}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedArchive.topProducts.map((prod) => (
            <div
              key={prod.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                theme === 'dark'
                  ? 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex gap-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <div className="absolute top-1 left-1 bg-indigo-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded">
                    #{prod.rank}
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    {prod.category}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-100 dark:text-white line-clamp-2 leading-snug">
                    {prod.name}
                  </h4>
                  <p className="text-xs font-black text-emerald-400">
                    {formatARS(prod.referencePriceARS)}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Ventas del mes: <strong className="text-slate-200 font-bold">{formatNumberAR(prod.unitsSold)} u.</strong>
                </span>

                <button
                  onClick={() => openComparison(prod)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Ver tiendas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

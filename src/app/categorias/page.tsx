'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  BarChart,
  Calendar,
  DollarSign,
  TrendingUp,
  Store,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { mockCategoriesData } from '@/data/categoriesData';
import { formatARS, formatCompactARS, formatNumberAR } from '@/lib/formatters';

export default function CategoriasPage() {
  const { currentProducts, periodLabel, theme, openComparison } = useApp();
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    mockCategoriesData[0].name
  );

  // Group products of active period by category and sort them from best to worst (by rank)
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, typeof currentProducts>();
    for (const prod of currentProducts) {
      if (!map.has(prod.category)) {
        map.set(prod.category, []);
      }
      map.get(prod.category)!.push(prod);
    }
    // Sort products inside each category by rank (best to worst)
    for (const [, list] of map) {
      list.sort((a, b) => a.rank - b.rank);
    }
    return map;
  }, [currentProducts]);

  // Selected category data
  const activeCategorySummary = mockCategoriesData.find(
    (c) => c.name === selectedCategoryName
  ) || mockCategoriesData[0];

  const activeCategoryProducts = categoryMap.get(selectedCategoryName) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Análisis Sectorial y Curvas de Demanda</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100 dark:text-white">
          Categorías Representadas en el Top 30
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comportamiento histórico y estacionalidad anual de los rubros líderes del mercado argentino para el período{' '}
          <strong>{periodLabel}</strong>. Cada categoría desglosa sus productos ordenados del mejor al peor ranking y la concentración de demanda por rangos de precio.
        </p>
      </div>

      {/* Category selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {mockCategoriesData.map((cat) => {
          const isSelected = cat.name === selectedCategoryName;
          const count = categoryMap.get(cat.name)?.length || 0;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategoryName(cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md scale-[1.02]'
                  : theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count} {count === 1 ? 'artículo' : 'artículos'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Overview Card */}
      <div
        className={`p-6 rounded-2xl border ${
          theme === 'dark'
            ? 'bg-[#090d16] border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-100 dark:text-white">
                {activeCategorySummary.name}
              </h2>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                {activeCategoryProducts.length} productos en Top 30
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Artículo insignia:{' '}
              <strong className="text-slate-200 font-semibold">
                {activeCategorySummary.topProduct}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">
                Unidades del Período
              </span>
              <span className="text-base font-black text-slate-100">
                {formatNumberAR(
                  activeCategoryProducts.reduce((acc, p) => acc + p.unitsSold, 0)
                )}{' '}
                u.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">
                Dinero Estimado
              </span>
              <span className="text-base font-black text-emerald-400">
                {formatCompactARS(
                  activeCategoryProducts.reduce((acc, p) => acc + p.estimatedRevenueARS, 0)
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Two Required Charts for the Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
          {/* Chart 1: Seasonality (12 Months Jan-Dec) */}
          <div
            className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-[#0b101c] border-slate-800/90' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-100 dark:text-white">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Estacionalidad Anual (Ene a Dic)
              </h3>
              <span className="text-[10px] text-cyan-400 font-semibold uppercase">Índice 0-100</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Meses en los que suelen venderse más sus productos en Argentina.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeCategorySummary.seasonality}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#06b6d4',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} pts`, 'Índice de Demanda']}
                  />
                  <Line
                    type="monotone"
                    dataKey="salesIndex"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 4 }}
                    activeDot={{ r: 6, fill: '#38bdf8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Accessible Text/Table representation */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              <details className="cursor-pointer">
                <summary className="font-semibold text-cyan-400 hover:text-cyan-300">
                  Ver tabla de valores de estacionalidad
                </summary>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mt-2 text-center">
                  {activeCategorySummary.seasonality.map((s) => (
                    <div key={s.month} className="p-1 rounded bg-slate-900 border border-slate-800">
                      <span className="font-bold text-slate-300 block">{s.month}</span>
                      <span className="text-cyan-400 font-semibold">{s.salesIndex}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* Chart 2: Price Bracket Concentration */}
          <div
            className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-[#0b101c] border-slate-800/90' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-100 dark:text-white">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Concentración de Ventas por Rango de Precio
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                Volumen (%)
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Franjas de ticket promedio con mayor penetración de compra en ARS.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={activeCategorySummary.priceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="rangeLabel" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} u. (${val}%)`, 'Volumen']}
                  />
                  <Bar dataKey="salesVolume" fill="#10b981" radius={[8, 8, 0, 0]}>
                    {activeCategorySummary.priceDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? '#10b981' : '#34d399'}
                      />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            {/* Accessible Alternative Table */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              <details className="cursor-pointer">
                <summary className="font-semibold text-emerald-400 hover:text-emerald-300">
                  Ver desglose porcentual por rango
                </summary>
                <div className="space-y-1 mt-2">
                  {activeCategorySummary.priceDistribution.map((p) => (
                    <div
                      key={p.rangeLabel}
                      className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800"
                    >
                      <span className="font-medium text-slate-300">{p.rangeLabel}</span>
                      <span className="font-bold text-emerald-400">
                        {p.salesVolume} ventas ({p.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Methodology & Historical Interval Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Intervalo histórico: <strong>{activeCategorySummary.historicalInterval}</strong>
            </span>
          </div>
          <span>Fuente: {activeCategorySummary.dataSource}</span>
        </div>
      </div>

      {/* List of Products in this Category (Ranked Best to Worst) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Productos de {activeCategorySummary.name} (Ordenados del mejor al peor ranking)
          </h3>
          <p className="text-xs text-slate-400">
            Criterio visible: Puesto original en el Top 30 según unidades vendidas en Argentina.
          </p>
        </div>

        {activeCategoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCategoryProducts.map((prod) => (
              <div
                key={prod.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  theme === 'dark'
                    ? 'bg-[#0a0e19] border-slate-800 hover:border-cyan-500/40'
                    : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                }`}
              >
                <div>
                  <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-2 left-2 bg-cyan-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                      Puesto #{prod.rank}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    {prod.presentation} • {prod.weightGrams}g
                  </span>
                  <h4 className="font-bold text-sm leading-snug line-clamp-2 text-slate-100 dark:text-white">
                    {prod.name}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Precio ARS</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {formatARS(prod.referencePriceARS)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Ventas del Período</span>
                      <span className="font-extrabold text-slate-200 text-sm">
                        {formatNumberAR(prod.unitsSold)} u.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openComparison(prod)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-cyan-600/90 hover:bg-cyan-500 text-white transition-colors"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Comparar precios</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/40">
            <Info className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold">Sin datos suficientes para este período.</p>
          </div>
        )}
      </div>
    </div>
  );
}

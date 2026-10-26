'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Package,
  TrendingUp,
  Search,
  Filter,
  Check,
  EyeOff,
  Eye,
  Store,
  ExternalLink,
  Flame,
  Calendar,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Product, ProductPresentation } from '@/types';
import { formatARS, formatCompactARS, formatNumberAR, formatDateAR } from '@/lib/formatters';

type SortOption = 'default' | 'price_desc' | 'price_asc' | 'sales_desc' | 'active_first';

export default function ProductosPage() {
  const {
    currentProducts,
    period,
    periodLabel,
    periodDateRange,
    theme,
    isProductActive,
    toggleProductActive,
    openComparison,
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPresentation, setSelectedPresentation] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [onlyViral, setOnlyViral] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');

  // Sorting state
  const [sortOption, setSortOption] = useState<SortOption>('default');

  // Top 10 for Summary Cards (calculated strictly on original Top 10 for the period)
  const originalTop10 = useMemo(() => currentProducts.slice(0, 10), [currentProducts]);
  const totalTop10Units = useMemo(
    () => originalTop10.reduce((acc, p) => acc + p.unitsSold, 0),
    [originalTop10]
  );
  const totalTop10Revenue = useMemo(
    () => originalTop10.reduce((acc, p) => acc + p.estimatedRevenueARS, 0),
    [originalTop10]
  );

  // Extract unique categories & events for filter dropdowns
  const categories = useMemo(() => {
    return Array.from(new Set(currentProducts.map((p) => p.category)));
  }, [currentProducts]);

  const commercialEvents = useMemo(() => {
    return Array.from(new Set(currentProducts.map((p) => p.relatedEvent).filter(Boolean))) as string[];
  }, [currentProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) => {
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(term);
        const matchesCategory = product.category.toLowerCase().includes(term);
        const matchesVariant = product.colorsVariants.some((v) => v.toLowerCase().includes(term));
        if (!matchesName && !matchesCategory && !matchesVariant) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Presentation
      if (selectedPresentation !== 'all' && product.presentation !== selectedPresentation) {
        return false;
      }

      // Price range
      if (minPrice !== '' && product.referencePriceARS < Number(minPrice)) return false;
      if (maxPrice !== '' && product.referencePriceARS > Number(maxPrice)) return false;

      // Virality
      if (onlyViral && (!product.viralityScore || product.viralityScore < 80)) return false;

      // Commercial event
      if (selectedEvent !== 'all' && product.relatedEvent !== selectedEvent) return false;

      return true;
    });
  }, [
    currentProducts,
    searchTerm,
    selectedCategory,
    selectedPresentation,
    minPrice,
    maxPrice,
    onlyViral,
    selectedEvent,
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortOption) {
      case 'price_desc':
        return list.sort((a, b) => b.referencePriceARS - a.referencePriceARS);
      case 'price_asc':
        return list.sort((a, b) => a.referencePriceARS - b.referencePriceARS);
      case 'sales_desc':
        return list.sort((a, b) => b.unitsSold - a.unitsSold);
      case 'active_first': {
        const activeList = list.filter((p) => isProductActive(p.id)).sort((a, b) => a.rank - b.rank);
        const inactiveList = list.filter((p) => !isProductActive(p.id)).sort((a, b) => a.rank - b.rank);
        return [...activeList, ...inactiveList];
      }
      case 'default':
      default:
        // Preserves original rank order
        return list.sort((a, b) => a.rank - b.rank);
    }
  }, [filteredProducts, sortOption, isProductActive]);

  // Split Top 10 and 11-30 while preserving visual difference
  const top10List = useMemo(() => {
    if (sortOption === 'default') {
      return sortedProducts.slice(0, 10);
    }
    // When non-default sort is active, items with original rank <= 10 maintain top-10 visual badge
    return sortedProducts.slice(0, 10);
  }, [sortedProducts, sortOption]);

  const remainingList = useMemo(() => {
    return sortedProducts.slice(10);
  }, [sortedProducts]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPresentation('all');
    setMinPrice('');
    setMaxPrice('');
    setOnlyViral(false);
    setSelectedEvent('all');
    setSortOption('default');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header and Context explanation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Package className="w-4 h-4" />
          <span>Mercado Libre & E-commerce Argentina</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100 dark:text-white">
          Catálogo Top 30 Productos en Tendencia
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Orden predeterminado según volumen estimado de ventas en Argentina durante el período{' '}
          <strong>{periodLabel}</strong> ({periodDateRange}). Se preserva el distintivo del puesto original en cada producto sin importar los filtros u ordenamientos aplicados.
        </p>
      </div>

      {/* Two Summary Cards above Top 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Units Sold Top 10 */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0c1424] to-[#070b13] border-cyan-500/30 shadow-lg'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-cyan-400 uppercase tracking-wider">
              Métricas Consolidadas Top 10
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {period === 'semanal' ? '7 Días' : '30 Días'}
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-100 dark:text-white">
            {formatNumberAR(totalTop10Units)}{' '}
            <span className="text-lg font-bold text-slate-400">unidades</span>
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Suma exacta de las unidades vendidas por los 10 productos líderes del ranking en el período activo.
            </span>
          </div>
        </div>

        {/* Card 2: Estimated Revenue Top 10 */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0c1424] to-[#070b13] border-cyan-500/30 shadow-lg'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Dinero Estimado Top 10
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[11px] font-bold">
              Estimación de Mercado
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-emerald-400">
            {formatCompactARS(totalTop10Revenue)}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Cálculo: Sumatoria de (Unidades del período × Precio de referencia ARS). Valor estimado no auditado directamente por balance fiscal.
            </span>
          </div>
        </div>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, categoría o variante de color..."
              aria-label="Buscar producto"
              className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <label htmlFor="sort-select" className="text-xs font-bold text-slate-400 whitespace-nowrap">
              Ordenar por:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className={`text-xs font-semibold py-2 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="default">Ranking original (Predeterminado)</option>
              <option value="sales_desc">Más vendidos</option>
              <option value="price_desc">Precio: de mayor a menor</option>
              <option value="price_asc">Precio: de menor a mayor</option>
              <option value="active_first">Activos primero</option>
            </select>

            {sortOption !== 'default' && (
              <button
                onClick={() => setSortOption('default')}
                title="Volver al orden predeterminado"
                className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-cyan-400 hover:bg-slate-700 transition-colors"
                aria-label="Restablecer orden predeterminado"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-800/60 text-xs">
          {/* Category */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="all">Todas ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Presentation */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Presentación</label>
            <select
              value={selectedPresentation}
              onChange={(e) => setSelectedPresentation(e.target.value)}
              className="w-full py-1.5 px-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="all">Todas</option>
              <option value="individual">Individual</option>
              <option value="combo">Combo</option>
              <option value="set">Set</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Precio Mín ($)</label>
            <input
              type="number"
              placeholder="Ej: 10000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full py-1.5 px-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Precio Máx ($)</label>
            <input
              type="number"
              placeholder="Ej: 40000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full py-1.5 px-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Commercial Event */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Evento Comercial</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full py-1.5 px-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="all">Todos los eventos</option>
              {commercialEvents.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>

          {/* Viral Filter and Reset */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => setOnlyViral((v) => !v)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 border transition-all ${
                onlyViral
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Virales</span>
            </button>

            <button
              onClick={resetFilters}
              title="Limpiar filtros"
              className="py-1.5 px-2.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Top 10 Section (Visual Prominence) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              Sección Principal: Top 1 al 10 en Argentina
            </h2>
            <p className="text-xs text-slate-400">
              Artículos de máximo volumen e impacto comercial.
            </p>
          </div>
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            {top10List.length} productos mostrados
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {top10List.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isTop10Prominent={true}
              isActive={isProductActive(product.id)}
              onToggleActive={() => toggleProductActive(product.id)}
              onOpenComparison={() => openComparison(product)}
              theme={theme}
            />
          ))}
        </div>
      </div>

      {/* Secondary Section: Puestos 11 al 30 (Compact Section) */}
      {remainingList.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Sección Secundaria: Puestos 11 al 30
              </h2>
              <p className="text-xs text-slate-400">
                Oportunidades de catálogo en expansión y productos complementarios de alta rotación.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              {remainingList.length} productos en lista
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {remainingList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isTop10Prominent={false}
                isActive={isProductActive(product.id)}
                onToggleActive={() => toggleProductActive(product.id)}
                onOpenComparison={() => openComparison(product)}
                theme={theme}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Product Card Component supporting prominent and compact views + active/dismissed graying
function ProductCard({
  product,
  isTop10Prominent,
  isActive,
  onToggleActive,
  onOpenComparison,
  theme,
}: {
  product: Product;
  isTop10Prominent: boolean;
  isActive: boolean;
  onToggleActive: () => void;
  onOpenComparison: () => void;
  theme: 'dark' | 'light';
}) {
  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        !isActive
          ? // Deactivated state: muted gray tones, darker, preserves rank & data
            theme === 'dark'
            ? 'bg-[#06080c] border-slate-800/60 opacity-60 grayscale-[85%]'
            : 'bg-slate-100 border-slate-300 opacity-60 grayscale-[85%]'
          : isTop10Prominent
          ? theme === 'dark'
            ? 'bg-[#0a0f1c] border-slate-800 hover:border-cyan-500/50 shadow-md'
            : 'bg-white border-slate-200 hover:border-cyan-400 shadow-md'
          : theme === 'dark'
          ? 'bg-[#080b13] border-slate-800/80 hover:border-slate-700'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5 flex gap-4">
        {/* Left Side: Activation / Dismissal toggle */}
        <div className="flex flex-col items-center justify-start shrink-0">
          <button
            onClick={onToggleActive}
            aria-label={
              isActive
                ? `Desactivar ${product.name} de mi selección`
                : `Activar ${product.name} en mi selección`
            }
            title={
              isActive
                ? 'Activo en mi selección (clic para descartar)'
                : 'Descartado de mi selección (clic para reactivar)'
            }
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            {isActive ? <Check className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          <span className="text-[10px] mt-1 font-bold text-slate-500 uppercase">
            {isActive ? 'Activo' : 'Gris'}
          </span>
        </div>

        {/* Thumbnail Image */}
        <div
          className={`relative rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950 ${
            isTop10Prominent ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-20 h-20'
          }`}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 96px, 112px"
          />
          {/* Original Rank Badge (ALWAYS PRESERVED) */}
          <div
            className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[11px] font-black shadow-md ${
              product.rank <= 3
                ? 'bg-amber-400 text-slate-950'
                : product.rank <= 10
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            #{product.rank}
          </div>
        </div>

        {/* Content details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
              {product.category}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 font-medium capitalize">
              {product.presentation}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 font-medium">{product.weightGrams}g</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-slate-100 dark:text-white">
            {product.name}
          </h3>

          {/* Ranking criteria text */}
          <p className="text-[11px] text-slate-500 truncate" title={product.rankingCriteria}>
            {product.rankingCriteria}
          </p>

          {/* Variants */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Variantes:</span>
            {product.colorsVariants.slice(0, 3).map((col, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {col}
              </span>
            ))}
            {product.colorsVariants.length > 3 && (
              <span className="text-[10px] text-slate-400">+{product.colorsVariants.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Bar & Badges */}
      <div className="px-4 pb-4 sm:px-5 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Precio Referencia ARS</span>
            <span className="text-sm sm:text-base font-black text-emerald-400">
              {formatARS(product.referencePriceARS)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Ventas del Período</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-200">
                {formatNumberAR(product.unitsSold)} u.
              </span>
              <span
                className={`text-[11px] font-bold ${
                  product.trendPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {product.trendPercentage >= 0 ? `+${product.trendPercentage}%` : `${product.trendPercentage}%`}
              </span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-semibold">Facturación Estimada</span>
            <span className="text-xs sm:text-sm font-bold text-cyan-400">
              {formatCompactARS(product.estimatedRevenueARS)}
            </span>
          </div>
        </div>

        {/* Virality and Event Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {product.viralityScore ? (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20"
                title={product.viralityRuleExplanation || 'Puntuación viral'}
              >
                <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                Score Viral: {product.viralityScore}/100
              </span>
            ) : null}

            {product.relatedEvent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Calendar className="w-3 h-3" />
                {product.relatedEvent}
              </span>
            )}
          </div>

          {/* Compare Prices Button */}
          <button
            onClick={onOpenComparison}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-sm"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Comparar precios</span>
          </button>
        </div>

        {/* Source and update timestamp */}
        <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-2">
          <span className="truncate max-w-[220px]">Fuente: {product.source}</span>
          <span>Actualizado: {formatDateAR(product.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}

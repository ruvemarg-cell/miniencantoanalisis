'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Store,
  ExternalLink,
  Search,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { formatARS, formatPercent } from '@/lib/formatters';

type ChannelType = 'meli_clasica' | 'meli_premium' | 'tienda_propia';

export default function CalculadoraPage() {
  const { currentProducts, periodLabel, theme, openComparison } = useApp();

  // Calculator inputs
  const [salePrice, setSalePrice] = useState<number>(38500);
  const [productCost, setProductCost] = useState<number>(18000);
  const [channel, setChannel] = useState<ChannelType>('meli_clasica');
  const [shippingCost, setShippingCost] = useState<number>(4200);
  const [freeShippingActive, setFreeShippingActive] = useState<boolean>(true);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(3.5); // IIBB
  const [adsPercent, setAdsPercent] = useState<number>(5.0); // Pauta digital
  const [packagingCost, setPackagingCost] = useState<number>(850); // Caja, bolsa, etiqueta

  // Product selector underneath (any of the 30 products from active period)
  const [selectedProductId, setSelectedProductId] = useState<string>(currentProducts[0]?.id || '');
  const [productSearch, setProductSearch] = useState<string>('');

  // Channel commission rates based on Argentine market benchmarks
  const channelDetails = {
    meli_clasica: {
      name: 'Mercado Libre (Publicación Clásica)',
      commissionPct: 13.5,
      fixedFee: salePrice < 25000 ? 1200 : 0, // Cargo fijo por unidad en productos de bajo ticket
      description: 'Comisión estándar por venta en Mercado Libre Argentina.',
    },
    meli_premium: {
      name: 'Mercado Libre (Publicación Premium)',
      commissionPct: 18.0,
      fixedFee: salePrice < 25000 ? 1200 : 0,
      description: 'Permite ofrecer hasta 6 cuotas sin interés a cargo del vendedor.',
    },
    tienda_propia: {
      name: 'Tienda Propia / Tiendanube',
      commissionPct: 5.5, // 1% costo por transacción + 4.5% pasarela de pago (Mercado Pago / Pago Nube)
      fixedFee: 0,
      description: 'Costo por transacción del plan + comisión de pasarela de pago.',
    },
  };

  const activeChannelConfig = channelDetails[channel];

  // Calculations
  const calculations = useMemo(() => {
    const price = Number(salePrice) || 0;
    const cost = Number(productCost) || 0;

    // Platform commission
    const platformCommissionARS = (price * activeChannelConfig.commissionPct) / 100 + activeChannelConfig.fixedFee;

    // Shipping cost to seller
    const effectiveShippingARS = freeShippingActive ? Number(shippingCost) || 0 : 0;

    // Taxes (IIBB sobre precio de venta)
    const taxesARS = (price * (Number(taxRatePercent) || 0)) / 100;

    // Advertising & Marketing
    const adsARS = (price * (Number(adsPercent) || 0)) / 100;

    // Packaging / extra
    const packARS = Number(packagingCost) || 0;

    // Total deductions
    const totalDeductionsARS = platformCommissionARS + effectiveShippingARS + taxesARS + adsARS + packARS;

    // Net cash received from channel
    const netCashIn = price - platformCommissionARS - effectiveShippingARS;

    // Net profit
    const netProfitARS = price - cost - totalDeductionsARS;

    // Net Margin % (Profit / Sale Price)
    const marginPercent = price > 0 ? (netProfitARS / price) * 100 : 0;

    // Markup % (Profit / Cost)
    const markupPercent = cost > 0 ? (netProfitARS / cost) * 100 : 0;

    // Break-even target price for 20% margin
    const targetMargin = 0.2;
    const combinedVariableRate = (activeChannelConfig.commissionPct + taxRatePercent + adsPercent) / 100;
    const fixedCosts = cost + effectiveShippingARS + packARS + activeChannelConfig.fixedFee;
    const breakEvenPrice =
      1 - (combinedVariableRate + targetMargin) > 0
        ? fixedCosts / (1 - (combinedVariableRate + targetMargin))
        : 0;

    return {
      platformCommissionARS,
      effectiveShippingARS,
      taxesARS,
      adsARS,
      packARS,
      totalDeductionsARS,
      netCashIn,
      netProfitARS,
      marginPercent,
      markupPercent,
      breakEvenPrice,
    };
  }, [
    salePrice,
    productCost,
    activeChannelConfig,
    freeShippingActive,
    shippingCost,
    taxRatePercent,
    adsPercent,
    packagingCost,
  ]);

  // Determine status color: Green (> 15%), Orange (0% - 15%), Red (< 0%)
  const profitStatus = useMemo(() => {
    if (calculations.netProfitARS < 0) {
      return {
        label: 'Pérdida Neta',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        icon: TrendingDown,
      };
    }
    if (calculations.marginPercent < 15) {
      return {
        label: 'Margen Reducido / Riesgo',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        icon: AlertCircle,
      };
    }
    return {
      label: 'Operación Rentable',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: CheckCircle,
    };
  }, [calculations]);

  // Selected product from list
  const selectedProduct = useMemo(() => {
    return (
      currentProducts.find((p) => p.id === selectedProductId) ||
      currentProducts[0]
    );
  }, [currentProducts, selectedProductId]);

  const filteredCatalogProducts = useMemo(() => {
    if (!productSearch.trim()) return currentProducts;
    const term = productSearch.toLowerCase();
    return currentProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [currentProducts, productSearch]);

  // Handler to load selected product price into calculator without erasing other settings
  const handleLoadProductPrice = (prod: Product) => {
    setSelectedProductId(prod.id);
    setSalePrice(prod.referencePriceARS);
    // Suggest estimated acquisition cost (~45% of sale price for benchmark)
    setProductCost(Math.round(prod.referencePriceARS * 0.45));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>Fórmulas de Costos y Rentabilidad Real en Argentina</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100 dark:text-white">
          Calculadora Ecom con Comparador de Precios
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Simula comisiones de Mercado Libre (Clásica y Premium) y Tiendanube, costos logísticos de Mercado Envíos, retenciones de Ingresos Brutos (IIBB) y pauta digital. Debajo puedes seleccionar cualquiera de los 30 productos del período para inspeccionar su comparativa sin alterar el desglose ingresado.
        </p>
      </div>

      {/* Main Grid: Inputs on Left, Results Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 Cols) */}
        <div
          className={`lg:col-span-7 p-6 rounded-2xl border space-y-5 ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-base flex items-center gap-2 text-slate-100 dark:text-white">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Parámetros de Costo y Venta (ARS)
            </h2>
            <span className="text-xs text-slate-400">Valores en Pesos Argentinos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sale Price */}
            <div>
              <label htmlFor="sale-price" className="text-xs font-bold text-slate-300 block mb-1">
                Precio de Venta al Público ($ ARS) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  id="sale-price"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border bg-slate-900 border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Product Acquisition Cost */}
            <div>
              <label htmlFor="prod-cost" className="text-xs font-bold text-slate-300 block mb-1">
                Costo del Producto / Proveedor ($ ARS) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  id="prod-cost"
                  type="number"
                  value={productCost}
                  onChange={(e) => setProductCost(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border bg-slate-900 border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Sales Channel */}
            <div className="sm:col-span-2">
              <label htmlFor="channel-type" className="text-xs font-bold text-slate-300 block mb-1">
                Canal de Venta y Régimen de Comisión
              </label>
              <select
                id="channel-type"
                value={channel}
                onChange={(e) => setChannel(e.target.value as ChannelType)}
                className="w-full py-2 px-3 rounded-xl border bg-slate-900 border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="meli_clasica">
                  Mercado Libre Clásica (13.5% + Cargo Fijo si &lt; $ 25.000)
                </option>
                <option value="meli_premium">
                  Mercado Libre Premium (18% con cuotas sin interés)
                </option>
                <option value="tienda_propia">
                  Tienda Propia / Tiendanube (5.5% combinado con pasarela de pago)
                </option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                {activeChannelConfig.description}
              </p>
            </div>

            {/* Shipping Cost & Toggle */}
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={freeShippingActive}
                    onChange={(e) => setFreeShippingActive(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>Envío Gratis a cargo del Vendedor (Mercado Envíos)</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {freeShippingActive ? 'Activo' : 'A cargo del comprador'}
                </span>
              </div>

              {freeShippingActive && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-slate-400">Costo de envío a tu cargo:</span>
                  <div className="relative w-36">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1 text-xs rounded-lg border bg-slate-900 border-slate-700 text-white font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Taxes (IIBB %) */}
            <div>
              <label htmlFor="tax-rate" className="text-xs font-bold text-slate-300 block mb-1">
                Ingresos Brutos (IIBB) (%)
              </label>
              <input
                id="tax-rate"
                type="number"
                step="0.1"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl border bg-slate-900 border-slate-700 text-white text-xs font-semibold"
              />
              <span className="text-[10px] text-slate-400">Promedio régimen simplificado 3.5%</span>
            </div>

            {/* Advertising % */}
            <div>
              <label htmlFor="ads-rate" className="text-xs font-bold text-slate-300 block mb-1">
                Publicidad Digital (Ads) (%)
              </label>
              <input
                id="ads-rate"
                type="number"
                step="0.5"
                value={adsPercent}
                onChange={(e) => setAdsPercent(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl border bg-slate-900 border-slate-700 text-white text-xs font-semibold"
              />
              <span className="text-[10px] text-slate-400">Inversión en pauta Meta / Google</span>
            </div>

            {/* Packaging cost */}
            <div className="sm:col-span-2">
              <label htmlFor="packaging-cost" className="text-xs font-bold text-slate-300 block mb-1">
                Caja, Embalaje y Cinta ($ ARS)
              </label>
              <input
                id="packaging-cost"
                type="number"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl border bg-slate-900 border-slate-700 text-white text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Results & Breakdown Card (5 Cols) */}
        <div
          className={`lg:col-span-5 p-6 rounded-2xl border space-y-5 flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#0b101c] border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-base flex items-center gap-2 text-slate-100 dark:text-white">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Resultado y Rentabilidad Real
              </h2>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${profitStatus.bg} ${profitStatus.color} ${profitStatus.border}`}
              >
                <profitStatus.icon className="w-3.5 h-3.5" />
                <span>{profitStatus.label}</span>
              </div>
            </div>

            {/* Main Profit Display */}
            <div className="mt-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Ganancia Neta Estimada por Unidad
              </span>
              <p className={`text-3xl sm:text-4xl font-black ${profitStatus.color}`}>
                {formatARS(calculations.netProfitARS)}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs pt-1">
                <span className="text-slate-300">
                  Margen: <strong className={profitStatus.color}>{formatPercent(calculations.marginPercent)}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">
                  Markup: <strong className="text-slate-200">{formatPercent(calculations.markupPercent)}</strong>
                </span>
              </div>
            </div>

            {/* Detailed Cost Breakdown Table */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>Precio de Venta:</span>
                <span className="font-bold text-slate-200">{formatARS(salePrice)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>(-) Costo del Producto:</span>
                <span className="font-bold text-rose-400">- {formatARS(productCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>(-) Comisión ({activeChannelConfig.commissionPct}%):</span>
                <span className="font-bold text-rose-400">- {formatARS(calculations.platformCommissionARS)}</span>
              </div>
              {freeShippingActive && (
                <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                  <span>(-) Envío Gratis a cargo del vendedor:</span>
                  <span className="font-bold text-rose-400">- {formatARS(calculations.effectiveShippingARS)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>(-) Impuestos / IIBB ({taxRatePercent}%):</span>
                <span className="font-bold text-rose-400">- {formatARS(calculations.taxesARS)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>(-) Pauta Digital ({adsPercent}%):</span>
                <span className="font-bold text-rose-400">- {formatARS(calculations.adsARS)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>(-) Embalaje y Packaging:</span>
                <span className="font-bold text-rose-400">- {formatARS(calculations.packARS)}</span>
              </div>
            </div>
          </div>

          {/* Break-Even Target Price Box */}
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1">
            <span className="font-bold text-cyan-300 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Precio Objetivo Sugerido (para 20% margen neto):
            </span>
            <p className="text-base font-black text-cyan-400">
              {formatARS(calculations.breakEvenPrice)}
            </p>
            <p className="text-[10px] text-slate-400">
              Fórmula inversa despejada con la suma de deducciones fijas y variables en pesos argentinos.
            </p>
          </div>
        </div>
      </div>

      {/* Linked Product Selector & Price Comparator Section */}
      <div
        className={`p-6 rounded-2xl border space-y-5 ${
          theme === 'dark' ? 'bg-[#080c14] border-cyan-500/30 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-100 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-cyan-400" />
              Comparador de Precios en Marketplaces Vinculado
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecciona cualquiera de los 30 productos del período activo (<strong>{periodLabel}</strong>) para inspeccionar precios en Mercado Libre, Amazon y AliExpress sin reiniciar los cálculos.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar catálogo de 30 productos..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-slate-900 border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Selected Product Banner */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold mb-0.5">
                <span>Puesto #{selectedProduct.rank}</span>
                <span>•</span>
                <span>{selectedProduct.category}</span>
                <span>•</span>
                <span className="capitalize">{selectedProduct.presentation}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 dark:text-white leading-snug">
                {selectedProduct.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">Precio de Referencia:</span>
                <span className="text-sm font-black text-emerald-400">
                  {formatARS(selectedProduct.referencePriceARS)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleLoadProductPrice(selectedProduct)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Cargar precio en calculadora
            </button>
            <button
              onClick={() => openComparison(selectedProduct)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5"
            >
              <span>Ver comparativa completa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll of 30 products */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 block">
            Elige un producto para comparar:
          </span>
          <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
            {filteredCatalogProducts.map((p) => {
              const isSelected = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border shrink-0 text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="w-44 truncate">
                    <span className="text-[10px] font-bold text-cyan-400 block">
                      #{p.rank} • {p.category}
                    </span>
                    <span className="text-xs font-bold truncate block">{p.name}</span>
                    <span className="text-xs text-emerald-400 font-extrabold block">
                      {formatARS(p.referencePriceARS)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

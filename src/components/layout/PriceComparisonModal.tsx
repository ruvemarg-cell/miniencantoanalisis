'use client';

import React from 'react';
import Image from 'next/image';
import { X, ExternalLink, CheckCircle, AlertTriangle, Store, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatARS, formatDateAR } from '@/lib/formatters';

export function PriceComparisonModal() {
  const { comparisonProduct, closeComparison, theme } = useApp();

  if (!comparisonProduct) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
          theme === 'dark'
            ? 'bg-[#0b101a] text-slate-100 border-cyan-500/40'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 id="comparison-title" className="text-lg font-bold leading-snug">
                Comparación de Precios en Marketplaces
              </h2>
              <p className="text-xs text-slate-400">
                Cobertura: Mercado Libre Argentina, Amazon, AliExpress y Comercio Local
              </p>
            </div>
          </div>

          <button
            onClick={closeComparison}
            aria-label="Cerrar modal de comparación"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Summary Header Card */}
        <div
          className={`px-6 py-4 border-b flex items-center gap-4 ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-cyan-50/50 border-cyan-100'
          }`}
        >
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 bg-slate-950">
            <Image
              src={comparisonProduct.imageUrl}
              alt={comparisonProduct.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap text-xs text-cyan-400 font-semibold mb-1">
              <span>Puesto #{comparisonProduct.rank}</span>
              <span>•</span>
              <span>{comparisonProduct.category}</span>
              <span>•</span>
              <span className="capitalize">{comparisonProduct.presentation}</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
              {comparisonProduct.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-slate-400">Precio de referencia:</span>
              <span className="text-sm font-extrabold text-emerald-400">
                {formatARS(comparisonProduct.referencePriceARS)}
              </span>
            </div>
          </div>
        </div>

        {/* Store Comparison Cards */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {comparisonProduct.storeComparisons && comparisonProduct.storeComparisons.length > 0 ? (
            comparisonProduct.storeComparisons.map((store, index) => {
              const isML = store.storeName.includes('Mercado Libre');
              const isAmazon = store.storeName.includes('Amazon');
              const isAliExpress = store.storeName.includes('AliExpress');

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50'
                      : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                  }`}
                >
                  {/* Store Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isML
                            ? 'bg-yellow-400/20 text-yellow-500 border border-yellow-500/30'
                            : isAmazon
                            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                            : isAliExpress
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {store.storeName}
                      </span>

                      {store.isExactMatch ? (
                        <span className="text-[11px] flex items-center gap-1 font-medium text-emerald-400">
                          <CheckCircle className="w-3 h-3" /> Misma variante exacta
                        </span>
                      ) : (
                        <span className="text-[11px] flex items-center gap-1 font-medium text-amber-400">
                          <AlertTriangle className="w-3 h-3" /> Artículo similar
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        Disp: <strong>{store.availability}</strong>
                      </span>
                    </div>

                    {store.notes && (
                      <p className="text-xs text-slate-400 italic">
                        {store.notes}
                      </p>
                    )}

                    <p className="text-[10px] text-slate-400">
                      Fecha de consulta: {formatDateAR(store.consultationDate)}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-right">
                      {store.currency === 'USD' ? (
                        <>
                          <div className="text-base font-extrabold text-cyan-400">
                            USD $ {store.price.toFixed(2)}
                          </div>
                          {store.convertedPriceARS && (
                            <div className="text-xs text-slate-400">
                              ≈ {formatARS(store.convertedPriceARS)} (Dólar Tarjeta)
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-base sm:text-lg font-black text-emerald-400">
                          {formatARS(store.price)}
                        </div>
                      )}
                    </div>

                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-sm"
                    >
                      <span>Ver publicación</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Tag className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold">Sin publicaciones encontradas para este artículo.</p>
              <p className="text-xs mt-1">
                No se inventan publicaciones ni precios si no se obtuvieron coincidencias válidas.
              </p>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div
          className={`px-6 py-3 border-t text-[11px] flex items-center justify-between text-slate-400 ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Datos auditados para el mercado argentino
          </span>
          <button
            onClick={closeComparison}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

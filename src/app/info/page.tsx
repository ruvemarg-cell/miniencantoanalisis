'use client';

import React, { useState, useEffect } from 'react';
import {
  Info,
  DollarSign,
  TrendingUp,
  Percent,
  ShoppingCart,
  Calendar,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatARS, formatNumberAR, getCountdownParts, formatDateAR } from '@/lib/formatters';

interface InfoDataState {
  dolares: {
    oficial?: { compra: number; venta: number; fecha: string; nombre: string };
    blue?: { compra: number; venta: number; fecha: string; nombre: string };
    tarjeta?: { venta: number; fecha: string; nombre: string };
  };
  inflacion: {
    ultimoDato: number | null;
    periodo: string;
    tipoVariacion: string;
    fuente: string;
    interanual?: number;
  };
  ventasMeliEstimadas: {
    unidadesDiarias: number;
    pesosDiariosARS: number;
    metodologia: string;
    ultimaActualizacion: string;
    fuente: string;
    esEstimacion: boolean;
  };
  proximaFechaComercial: {
    nombre: string;
    fechaTexto: string;
    targetIso: string;
  };
  status: 'ONLINE' | 'FALLBACK_PARCIAL';
  consultedAt: string;
}

export default function InfoPage() {
  const { theme } = useApp();
  const [data, setData] = useState<InfoDataState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/info');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update countdown clock in real time
  useEffect(() => {
    if (!data?.proximaFechaComercial?.targetIso) return;
    const updateCountdown = () => {
      setCountdown(getCountdownParts(data.proximaFechaComercial.targetIso));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data?.proximaFechaComercial?.targetIso]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Monitoreo Macroeconómico e Indicadores de Referencia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100 dark:text-white">
            Información Oficial y Cotizaciones en Argentina
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Esta sección opera con frecuencia diaria e independiente del selector Semanal/Mensual. Los tipos de cambio e inflación provienen de fuentes oficiales e informativas verificadas (BCRA / INDEC).
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Consultando...' : 'Actualizar ahora'}</span>
        </button>
      </div>

      {/* Grid of Key Macro Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Dólar Oficial */}
        <div
          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                Dólar Oficial
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px]">
                BCRA / BNA
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-100 dark:text-white mb-3">
              Tipo de Cambio Oficial Mayorista / Minorista
            </h2>

            {data?.dolares.oficial ? (
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Compra</span>
                  <span className="text-lg font-black text-slate-200">
                    $ {data.dolares.oficial.compra.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Venta</span>
                  <span className="text-lg font-black text-emerald-400">
                    $ {data.dolares.oficial.venta.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Cargando cotización oficial...</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate">Fuente: Banco Central de la República Argentina</span>
            <span className="text-[10px]">
              {data?.dolares.oficial?.fecha ? formatDateAR(data.dolares.oficial.fecha) : 'En vivo'}
            </span>
          </div>
        </div>

        {/* Card 2: Dólar Blue */}
        <div
          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                Dólar Blue
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                Mercado Informal
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-100 dark:text-white mb-3">
              Cotización Libre de Referencia
            </h2>

            {data?.dolares.blue ? (
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Compra</span>
                  <span className="text-lg font-black text-slate-200">
                    $ {data.dolares.blue.compra.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Venta</span>
                  <span className="text-lg font-black text-cyan-400">
                    $ {data.dolares.blue.venta.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Cargando cotización blue...</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate">Fuente: Ámbito Financiero / DolarApi</span>
            <span className="text-[10px]">
              {data?.dolares.blue?.fecha ? formatDateAR(data.dolares.blue.fecha) : 'En vivo'}
            </span>
          </div>
        </div>

        {/* Card 3: Dólar Tarjeta */}
        <div
          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                Dólar Tarjeta / Turista
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                Importaciones / Courier
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-100 dark:text-white mb-3">
              Cotización Aplicable a Compras en el Exterior
            </h2>

            {data?.dolares.tarjeta ? (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">
                  Valor Venta Final (+ Recargos País/Ganancias)
                </span>
                <span className="text-2xl font-black text-amber-400">
                  $ {data.dolares.tarjeta.venta.toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Cargando cotización tarjeta...</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate">Fuente: AFIP / ARCA régimen cambiario</span>
            <span className="text-[10px]">
              {data?.dolares.tarjeta?.fecha ? formatDateAR(data.dolares.tarjeta.fecha) : 'En vivo'}
            </span>
          </div>
        </div>

        {/* Card 4: Inflación INDEC */}
        <div
          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Percent className="w-4 h-4" />
                Índice de Precios al Consumidor (IPC)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px]">
                INDEC Oficial
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-100 dark:text-white mb-2">
              Último Dato de Inflación Publicado
            </h2>

            {data?.inflacion ? (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Variación Mensual:</span>
                  <span className="text-2xl font-black text-purple-400">
                    +{data.inflacion.ultimoDato}%
                  </span>
                </div>
                {data.inflacion.interanual && (
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-800">
                    <span className="text-xs text-slate-400">Variación Interanual:</span>
                    <span className="text-sm font-bold text-slate-200">
                      +{data.inflacion.interanual}%
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-slate-500 block pt-1">
                  Período: {data.inflacion.periodo} ({data.inflacion.tipoVariacion})
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Consultando último informe INDEC...</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate">Fuente: Instituto Nacional de Estadística y Censos (INDEC)</span>
            <span className="text-[10px]">Publicación Mensual</span>
          </div>
        </div>

        {/* Card 5: Estimación de Ventas Diarias Mercado Libre Argentina */}
        <div
          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ShoppingCart className="w-4 h-4" />
                Ventas Diarias Estimadas MLA
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                Estimación de Mercado
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-100 dark:text-white mb-2">
              Volumen Diario Mercado Libre Argentina
            </h2>

            {data?.ventasMeliEstimadas ? (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Unidades / día:</span>
                  <span className="text-xl font-black text-emerald-400">
                    ≈ {formatNumberAR(data.ventasMeliEstimadas.unidadesDiarias)} u.
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-slate-800 pt-1">
                  <span className="text-xs text-slate-400">Facturación / día:</span>
                  <span className="text-sm font-bold text-cyan-400">
                    ≈ {formatARS(data.ventasMeliEstimadas.pesosDiariosARS)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Calculando inferencia de mercado...</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="line-clamp-2 text-[10px] leading-relaxed">
              <strong>Metodología:</strong> {data?.ventasMeliEstimadas?.metodologia}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>Modelo de inferencia no auditado por ML</span>
              <span>{data?.ventasMeliEstimadas?.ultimaActualizacion ? formatDateAR(data.ventasMeliEstimadas.ultimaActualizacion) : 'Hoy'}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Próxima Fecha Comercial Cercana con Countdown */}
        <div
          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                Fecha Comercial Más Cercana
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                En Tiempo Real
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-100 dark:text-white mb-2">
              {data?.proximaFechaComercial?.nombre || 'CyberMonday Argentina 2026'}
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              {data?.proximaFechaComercial?.fechaTexto || '02 al 04 de Noviembre 2026'}
            </p>

            {/* Countdown timer */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="block text-xl font-black text-cyan-400">{countdown.days}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Días</span>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="block text-xl font-black text-cyan-400">{countdown.hours}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Horas</span>
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

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Hora oficial Argentina (ART)</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Reloj activo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

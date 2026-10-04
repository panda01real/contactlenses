import React from 'react';
import { Eye, ShieldAlert, ShieldCheck, Clock, Calendar, RefreshCw, AlertTriangle, Sparkles, Droplets, Info } from 'lucide-react';
import { LensPair } from '../types';

interface LensStatusCardProps {
  activePair: LensPair;
  stats: {
    wornCount: number;
    calendarDaysElapsed: number;
    daysUsed: number;
    daysRemaining: number;
    isExpired: boolean;
    progressPercent: number;
    caseDaysElapsed: number;
  };
  onOpenNewPairModal: () => void;
  onEditPairModal: () => void;
  onToggleCalcMode: () => void;
}

export const LensStatusCard: React.FC<LensStatusCardProps> = ({
  activePair,
  stats,
  onOpenNewPairModal,
  onEditPairModal,
  onToggleCalcMode,
}) => {
  const isUrgent = stats.isExpired || stats.daysRemaining <= 2;
  const isWarning = !isUrgent && stats.daysRemaining <= 5;

  // Formatted start date
  const formattedStart = React.useMemo(() => {
    try {
      const [y, m, d] = activePair.startDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return activePair.startDate;
    }
  }, [activePair.startDate]);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                stats.isExpired
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : stats.daysRemaining <= 4
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              {stats.isExpired ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>¡Vencidos! Cambiar</span>
                </>
              ) : stats.daysRemaining <= 4 ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Próximo a cambiar</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>En período óptimo</span>
                </>
              )}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Iniciado: {formattedStart}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {activePair.name}
          </h3>
          {activePair.brand && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activePair.brand} · {activePair.totalLifespanDays} días de duración
            </p>
          )}
        </div>

        <button
          onClick={onEditPairModal}
          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 p-1"
        >
          Editar par
        </button>
      </div>

      {/* Main Days Remaining Display & Meter */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 dark:from-slate-800/60 dark:to-sky-950/20 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Huge Remaining Number */}
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Tiempo de vida restante
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span
              className={`text-5xl font-black tracking-tight ${
                stats.isExpired
                  ? 'text-rose-600 dark:text-rose-400'
                  : isWarning
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              {stats.daysRemaining}
            </span>
            <span className="text-base font-bold text-slate-600 dark:text-slate-300">
              días restantes
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Has utilizado <strong>{stats.daysUsed}</strong> de los <strong>{activePair.totalLifespanDays}</strong> días totales.
          </p>
        </div>

        {/* Right: Progress Circle / Gauge */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * stats.progressPercent) / 100}
              strokeLinecap="round"
              className={`transition-all duration-700 ${
                stats.isExpired
                  ? 'text-rose-500'
                  : isWarning
                  ? 'text-amber-500'
                  : 'text-sky-500'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">
              {stats.progressPercent}%
            </span>
            <span className="text-[9px] text-slate-400">usado</span>
          </div>
        </div>
      </div>

      {/* Dual Stats Breakdown & Calculation Mode Explanation */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 block">Días de uso real:</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {stats.wornCount} días
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Días que te los pusiste</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 block">Días corridos desde apertura:</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {stats.calendarDaysElapsed} días
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Tiempo desde que abriste el blíster</span>
        </div>
      </div>

      {/* Calculation Mode Selector */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Modo de cálculo activo:
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              {activePair.calculationMode === 'actual_wear'
                ? 'Cuenta solo los días que efectivamente te los pones'
                : 'Cuenta todos los días corridos desde que los abriste'}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleCalcMode}
          className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-semibold hover:bg-sky-50 dark:hover:bg-slate-700 transition"
        >
          Cambiar
        </button>
      </div>

      {/* Prescription Snapshot OD / OS */}
      {(activePair.rightEye || activePair.leftEye) && (
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Graduación médica guardada</span>
            {activePair.solutionBrand && (
              <span className="font-normal text-[11px] text-slate-500">
                Solución: {activePair.solutionBrand}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-sky-600 block">OD (Ojo Derecho)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {activePair.rightEye?.sphere || '0.00'} D
              </span>
              <span className="text-[10px] text-slate-400 block">
                BC: {activePair.rightEye?.baseCurve || '8.5'} · DIA: {activePair.rightEye?.diameter || '14.2'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-sky-600 block">OS (Ojo Izquierdo)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {activePair.leftEye?.sphere || '0.00'} D
              </span>
              <span className="text-[10px] text-slate-400 block">
                BC: {activePair.leftEye?.baseCurve || '8.5'} · DIA: {activePair.leftEye?.diameter || '14.2'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Estuche higiene note */}
      <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-500" />
          <span className="text-slate-600 dark:text-slate-400">
            Estuche: en uso hace <strong>{stats.caseDaysElapsed}</strong> días (cambiar cada 90 días)
          </span>
        </div>
      </div>

      {/* Button to start/open new pair */}
      <button
        onClick={onOpenNewPairModal}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-98 transition flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>Abrir nuevo par de lentes (Renovar)</span>
      </button>
    </div>
  );
};

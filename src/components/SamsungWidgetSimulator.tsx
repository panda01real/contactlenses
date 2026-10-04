import React, { useState } from 'react';
import { Eye, Check, X, Sparkles, RefreshCw, Calendar, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { DailyLog, LensPair } from '../types';
import { hapticFeedback } from '../services/haptics';

interface SamsungWidgetSimulatorProps {
  activePair: LensPair;
  todayLog: DailyLog | undefined;
  stats: {
    daysUsed: number;
    daysRemaining: number;
    progressPercent: number;
    isExpired: boolean;
    calendarDaysElapsed: number;
    wornCount: number;
  };
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onToggleToday: (worn: boolean) => void;
  onOpenNewPairModal: () => void;
}

export const SamsungWidgetSimulator: React.FC<SamsungWidgetSimulatorProps> = ({
  activePair,
  todayLog,
  stats,
  soundEnabled,
  vibrationEnabled,
  onToggleToday,
  onOpenNewPairModal,
}) => {
  const [widgetSize, setWidgetSize] = useState<'4x2' | '2x2'>('4x2');
  const [widgetTheme, setWidgetTheme] = useState<'glass-dark' | 'glass-light'>('glass-dark');

  const isWornToday = todayLog?.worn === true;
  const hasLoggedToday = todayLog !== undefined;

  const handleQuickToggle = () => {
    const nextWorn = !isWornToday;
    hapticFeedback(nextWorn ? 'wear' : 'not_wear', soundEnabled, vibrationEnabled);
    onToggleToday(nextWorn);
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-100 to-slate-200/70 dark:from-slate-900/90 dark:to-slate-950 p-5 shadow-sm space-y-4">
      {/* Header with Samsung One UI label and size toggles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-xs">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Widget One UI 6 (Samsung S23 FE)
            </h3>
            <p className="text-[11px] text-slate-500">Simulación interactiva de Widget Android</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setWidgetSize('4x2')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              widgetSize === '4x2'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            4 × 2
          </button>
          <button
            onClick={() => setWidgetSize('2x2')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              widgetSize === '2x2'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            2 × 2
          </button>
          <button
            onClick={() => setWidgetTheme(prev => (prev === 'glass-dark' ? 'glass-light' : 'glass-dark'))}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            title="Alternar estilo claro / oscuro"
          >
            🎨
          </button>
        </div>
      </div>

      {/* Widget Render Container with simulated Android One UI Wallpaper background */}
      <div className="relative rounded-3xl overflow-hidden p-4 bg-gradient-to-br from-indigo-900 via-sky-950 to-slate-950 shadow-inner flex items-center justify-center min-h-[190px]">
        {/* Ambient wallpaper glow */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.35),transparent_60%)] pointer-events-none" />

        {/* 4x2 Wide Widget */}
        {widgetSize === '4x2' && (
          <div
            className={`relative w-full max-w-sm rounded-[26px] p-4 transition-all duration-300 backdrop-blur-md shadow-2xl border ${
              widgetTheme === 'glass-dark'
                ? 'bg-slate-900/80 text-white border-white/10'
                : 'bg-white/85 text-slate-900 border-white/60 shadow-sky-900/10'
            }`}
          >
            {/* Widget Top Bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white">
                  <Eye className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide uppercase opacity-75">
                  OcuTrack · Lentes
                </span>
              </div>
              <span className="text-[11px] font-mono opacity-60">
                {activePair.calculationMode === 'actual_wear' ? 'Días reales' : 'Calendario'}
              </span>
            </div>

            {/* Widget Content Grid */}
            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Left Column: Remaining Days Counter */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {stats.daysRemaining}
                  </span>
                  <span className="text-xs font-semibold opacity-70">
                    días restantes
                  </span>
                </div>

                <div className="w-full bg-slate-500/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.isExpired
                        ? 'bg-rose-500'
                        : stats.daysRemaining <= 4
                        ? 'bg-amber-400'
                        : 'bg-gradient-to-r from-sky-400 to-emerald-400'
                    }`}
                    style={{ width: `${stats.progressPercent}%` }}
                  />
                </div>

                <p className="text-[10px] opacity-70 pt-0.5">
                  {stats.daysUsed} de {activePair.totalLifespanDays} días usados ({stats.progressPercent}%)
                </p>
              </div>

              {/* Right Column: Today's Status & Quick 1-Tap Toggle */}
              <div className="flex flex-col items-end justify-center">
                <div className="text-right mb-1.5">
                  <span className="text-[10px] uppercase tracking-wider block opacity-60">
                    Estado de hoy
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                      isWornToday
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/20'
                    }`}
                  >
                    {isWornToday ? '¡Puestos! 👁️' : 'Sin poner 💤'}
                  </span>
                </div>

                {/* 1-Tap interactive toggle inside widget */}
                <button
                  onClick={handleQuickToggle}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                    isWornToday
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-sky-500 hover:bg-sky-600 text-white'
                  }`}
                >
                  {isWornToday ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Registrado</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Me los puse</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom notification indicator */}
            {stats.isExpired && (
              <div className="mt-2.5 pt-2 border-t border-rose-500/30 flex items-center justify-between text-[11px] text-rose-300">
                <span className="flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> ¡Vencidos! Cambiar par
                </span>
                <button
                  onClick={onOpenNewPairModal}
                  className="underline text-[10px] hover:text-white"
                >
                  Abrir par
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2x2 Compact Widget */}
        {widgetSize === '2x2' && (
          <div
            className={`relative w-44 h-44 rounded-[26px] p-3.5 transition-all duration-300 backdrop-blur-md shadow-2xl border flex flex-col justify-between ${
              widgetTheme === 'glass-dark'
                ? 'bg-slate-900/85 text-white border-white/10'
                : 'bg-white/90 text-slate-900 border-white/60 shadow-sky-900/10'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="w-4 h-4 rounded-md bg-sky-500 flex items-center justify-center text-white">
                <Eye className="w-2.5 h-2.5" />
              </div>
              <span className="text-[10px] font-semibold opacity-70">
                {stats.daysRemaining}d restantes
              </span>
            </div>

            {/* Center Gauge */}
            <div className="flex flex-col items-center justify-center py-1">
              <span className="text-3xl font-black tracking-tight leading-none">
                {stats.daysRemaining}
              </span>
              <span className="text-[10px] font-medium opacity-60 mt-0.5">
                días restantes
              </span>
            </div>

            {/* Bottom 1-Tap Toggle */}
            <button
              onClick={handleQuickToggle}
              className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                isWornToday
                  ? 'bg-emerald-500 text-white'
                  : 'bg-sky-500 text-white'
              }`}
            >
              {isWornToday ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Hoy: Puestos</span>
                </>
              ) : (
                <>
                  <span>Marcar uso</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Instructional note about Android / Samsung Home Screen */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-600 dark:text-slate-300">
        <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>En tu Samsung Galaxy S23 FE:</strong> Al instalar la app en tu pantalla de inicio mediante Chrome o Samsung Internet, tendrás el acceso directo diario. Los datos que marques aquí o en el widget se sincronizan automáticamente en tiempo real.
        </p>
      </div>
    </div>
  );
};

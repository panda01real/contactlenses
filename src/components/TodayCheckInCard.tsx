import React, { useState } from 'react';
import { Eye, Check, X, Clock, Sparkles, RefreshCw, Sun, Moon, Info, HeartPulse } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyLog } from '../types';
import { hapticFeedback } from '../services/haptics';

interface TodayCheckInCardProps {
  todayLog: DailyLog | undefined;
  todayDateKey: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onLogWear: (worn: boolean, hours?: number, notes?: string) => void;
  onClearLog: () => void;
}

export const TodayCheckInCard: React.FC<TodayCheckInCardProps> = ({
  todayLog,
  todayDateKey,
  soundEnabled,
  vibrationEnabled,
  onLogWear,
  onClearLog,
}) => {
  const [showHoursEditor, setShowHoursEditor] = useState(false);
  const [hours, setHours] = useState<number>(todayLog?.hoursWorn || 8);
  const [noteInput, setNoteInput] = useState<string>(todayLog?.notes || '');

  // Format today's date in friendly Spanish (e.g. "Sábado, 4 de Octubre de 2026")
  const formattedDate = React.useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    const str = today.toLocaleDateString('es-ES', options);
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  const handleSelectWorn = (worn: boolean) => {
    hapticFeedback(worn ? 'wear' : 'not_wear', soundEnabled, vibrationEnabled);
    if (worn) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.65 },
          colors: ['#0ea5e9', '#06b6d4', '#10b981', '#38bdf8'],
        });
      } catch {
        // ignore
      }
    }
    onLogWear(worn, worn ? 8 : 0);
  };

  const handleSaveDetails = () => {
    hapticFeedback('tap', soundEnabled, vibrationEnabled);
    if (todayLog) {
      onLogWear(todayLog.worn, hours, noteInput.trim() || undefined);
    }
    setShowHoursEditor(false);
  };

  const isWorn = todayLog?.worn === true;
  const isRest = todayLog?.worn === false;
  const isLogged = todayLog !== undefined;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-sky-50/60 dark:from-slate-900 dark:to-slate-900/80 border border-sky-100 dark:border-slate-800 p-6 shadow-sm shadow-sky-500/5 transition-all">
      {/* Background hydro reflection accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-2xl pointer-events-none" />

      {/* Date Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
          <Sun className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Registro Diario</span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {formattedDate}
        </span>
      </div>

      {/* Main Question / Title */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          ¿Te pusiste los lentes de contacto hoy?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isLogged
            ? 'Registro guardado para hoy. Puedes modificarlo cuando lo desees.'
            : 'Un solo toque para mantener tu cuenta al día.'}
        </p>
      </div>

      {/* Action Buttons or Logged Summary */}
      {!isLogged ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Option: SÍ, ME LOS PUSE */}
          <button
            onClick={() => handleSelectWorn(true)}
            className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold shadow-lg shadow-sky-500/25 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left">
                <span className="block text-base leading-tight">Sí, me los puse</span>
                <span className="text-[11px] font-normal text-sky-100">Contar día de uso</span>
              </div>
            </div>
            <Check className="w-5 h-5 stroke-[2.5] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
          </button>

          {/* Option: NO, HOY NO ME LOS PUSE */}
          <button
            onClick={() => handleSelectWorn(false)}
            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold border border-slate-200/80 dark:border-slate-700 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-left">
                <span className="block text-base leading-tight">No me los puse</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  Día de descanso
                </span>
              </div>
            </div>
            <X className="w-5 h-5 opacity-60 group-hover:opacity-100 transition" />
          </button>
        </div>
      ) : (
        /* Card content when already logged today */
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isWorn
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  isWorn
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isWorn ? <Check className="w-6 h-6 stroke-[3]" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base">
                    {isWorn ? '¡Lentes puestos hoy!' : 'Día de descanso (Sin lentes)'}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/30">
                    {todayLog.timestamp}
                  </span>
                </div>
                <p className="text-xs opacity-80 mt-0.5">
                  {isWorn
                    ? `Uso estimado: ${todayLog.hoursWorn || 8} horas${
                        todayLog.notes ? ` · "${todayLog.notes}"` : ''
                      }`
                    : 'Excelente para oxigenar tu córnea y descansar.'}
                </p>
              </div>
            </div>

            {/* Quick Switch Button */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowHoursEditor(!showHoursEditor)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition"
              >
                Detalles
              </button>
              <button
                onClick={() => handleSelectWorn(!isWorn)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800 transition"
                title="Cambiar respuesta"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible Details Editor (Hours & Notes) */}
          {showHoursEditor && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Horas de uso hoy:</span>
                <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
                  {hours} horas
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="16"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1h (Mínimo)</span>
                <span>8h (Estándar)</span>
                <span>16h (Máx recomendado)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Notas de hoy (ej. gotas humectantes, molestia, viaje):
                </label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Ej: Mucho viento hoy, use lágrimas artificiales"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowHoursEditor(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          )}

          {/* Quick Health Tip based on status */}
          {isWorn && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>
                Recordatorio de salud ocular: Nunca duermas con lentes puestos a menos que tu oftalmólogo lo haya indicado expresamente.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

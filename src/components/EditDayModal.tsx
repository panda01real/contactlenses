import React, { useState } from 'react';
import { X, Check, Eye, Moon, Trash2 } from 'lucide-react';
import { DailyLog } from '../types';

interface EditDayModalProps {
  dateKey: string;
  existingLog?: DailyLog;
  onSave: (dateKey: string, worn: boolean, hours?: number, notes?: string) => void;
  onDelete: (dateKey: string) => void;
  onClose: () => void;
}

export const EditDayModal: React.FC<EditDayModalProps> = ({
  dateKey,
  existingLog,
  onSave,
  onDelete,
  onClose,
}) => {
  const [worn, setWorn] = useState<boolean>(existingLog?.worn ?? true);
  const [hours, setHours] = useState<number>(existingLog?.hoursWorn ?? 8);
  const [notes, setNotes] = useState<string>(existingLog?.notes ?? '');

  // Formatted date
  const formattedDate = React.useMemo(() => {
    try {
      const [y, m, d] = dateKey.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateKey;
    }
  }, [dateKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dateKey, worn, worn ? hours : 0, notes.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white capitalize">
              {formattedDate}
            </h3>
            <p className="text-xs text-slate-500">Editar registro de uso</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              ¿Usaste los lentes este día?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWorn(true)}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  worn
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Sí, me los puse</span>
              </button>

              <button
                type="button"
                onClick={() => setWorn(false)}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  !worn
                    ? 'bg-slate-700 text-white border-slate-700 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>No me los puse</span>
              </button>
            </div>
          </div>

          {worn && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Horas de uso aproximadas: <span className="text-sky-600 font-bold">{hours}h</span>
              </label>
              <input
                type="range"
                min="1"
                max="16"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas (opcional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej: Día completo en computadora"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {existingLog ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(dateKey);
                  onClose();
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                title="Eliminar registro"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

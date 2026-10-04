import React, { useState } from 'react';
import { X, History, Archive, Download, Upload, Calendar, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { LensPair } from '../types';
import { storageService } from '../services/storage';

interface HistoryModalProps {
  history: LensPair[];
  onImportSuccess: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onImportSuccess,
  onClose,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = storageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocutrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const ok = storageService.importBackup(content);
        if (ok) {
          setImportStatus('¡Datos restaurados con éxito!');
          setTimeout(() => {
            onImportSuccess();
            onClose();
          }, 1200);
        } else {
          setImportStatus('Error: Archivo inválido.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Historial de Pares Anteriores
              </h3>
              <p className="text-xs text-slate-500">Registro histórico y copias de seguridad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aún no tienes pares archivados.</p>
              <p className="text-[11px] mt-1 text-slate-500">
                Cuando abras un nuevo par, el par actual quedará registrado aquí.
              </p>
            </div>
          ) : (
            history.map((pair, idx) => (
              <div
                key={pair.id || idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {pair.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {pair.brand || 'Marca no especificada'} · {pair.totalLifespanDays} días de duración
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Archivado
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Iniciado: {pair.startDate}</span>
                  </div>
                  {pair.archivedDate && (
                    <span>· Finalizado: {pair.archivedDate}</span>
                  )}
                </div>

                {pair.notes && (
                  <p className="text-xs text-slate-500 italic bg-white/70 dark:bg-slate-900/60 p-2 rounded-xl">
                    "{pair.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Backup Export / Import */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Copia de Seguridad (Backup)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-sky-500" />
              <span>Exportar datos</span>
            </button>

            <label className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-sky-500" />
              <span>Importar copia</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center pt-1">
              {importStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

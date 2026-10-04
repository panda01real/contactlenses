import React, { useState } from 'react';
import { X, Sparkles, Check, Info, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalculationMode, LensDurationType, LensPair } from '../types';
import { formatDateKey } from '../services/storage';

interface PairConfigModalProps {
  currentPair: LensPair;
  isNewPairMode: boolean; // true = Renewing / Starting new pair; false = Editing current
  onSave: (pairData: Partial<LensPair>, isNewPair: boolean) => void;
  onClose: () => void;
}

export const PairConfigModal: React.FC<PairConfigModalProps> = ({
  currentPair,
  isNewPairMode,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(isNewPairMode ? currentPair.name : currentPair.name);
  const [brand, setBrand] = useState(currentPair.brand || '');
  const [durationType, setDurationType] = useState<LensDurationType>(currentPair.durationType);
  const [totalDays, setTotalDays] = useState<number>(currentPair.totalLifespanDays);
  const [calcMode, setCalcMode] = useState<CalculationMode>(currentPair.calculationMode);
  const [startDate, setStartDate] = useState(isNewPairMode ? formatDateKey() : currentPair.startDate);
  const [notes, setNotes] = useState(isNewPairMode ? '' : (currentPair.notes || ''));

  // Optical info
  const [showRx, setShowRx] = useState(Boolean(currentPair.rightEye || currentPair.leftEye));
  const [odSphere, setOdSphere] = useState(currentPair.rightEye?.sphere || '-2.50');
  const [osSphere, setOsSphere] = useState(currentPair.leftEye?.sphere || '-2.75');
  const [baseCurve, setBaseCurve] = useState(currentPair.rightEye?.baseCurve || '8.5');
  const [diameter, setDiameter] = useState(currentPair.rightEye?.diameter || '14.2');
  const [solution, setSolution] = useState(currentPair.solutionBrand || 'ReNu MultiPlus');

  const handleDurationPreset = (type: LensDurationType, days: number) => {
    setDurationType(type);
    setTotalDays(days);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNewPairMode) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }

    const updatedData: Partial<LensPair> = {
      name: name.trim() || 'Lentes de Contacto',
      brand: brand.trim(),
      durationType,
      totalLifespanDays: totalDays,
      calculationMode: calcMode,
      startDate,
      notes: notes.trim(),
      solutionBrand: solution.trim(),
      caseLastReplacedDate: isNewPairMode ? startDate : currentPair.caseLastReplacedDate,
      rightEye: showRx
        ? {
            sphere: odSphere,
            baseCurve,
            diameter,
          }
        : undefined,
      leftEye: showRx
        ? {
            sphere: osSphere,
            baseCurve,
            diameter,
          }
        : undefined,
    };

    onSave(updatedData, isNewPairMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isNewPairMode ? 'Abrir Nuevo Par de Lentes' : 'Configurar Par Actual'}
              </h3>
              <p className="text-xs text-slate-500">
                {isNewPairMode
                  ? 'Inicia el conteo desde cero y archiva el par anterior'
                  : 'Modifica los parámetros de tus lentes activos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick presets for duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tipo de lente y duración:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleDurationPreset('monthly', 30)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  totalDays === 30
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Mensuales (30d)
              </button>

              <button
                type="button"
                onClick={() => handleDurationPreset('biweekly', 14)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  totalDays === 14
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Quincenales (14d)
              </button>

              <button
                type="button"
                onClick={() => handleDurationPreset('daily', 1)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  totalDays === 1
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Diarios (1d)
              </button>

              <button
                type="button"
                onClick={() => handleDurationPreset('quarterly', 90)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  totalDays === 90
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Trimestrales (90d)
              </button>
            </div>
          </div>

          {/* Custom Days Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Días de duración máxima:
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={totalDays}
                onChange={e => setTotalDays(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Fecha de inicio / apertura:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Calculation Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Método para contar los días:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCalcMode('actual_wear')}
                className={`p-3 rounded-2xl border text-left transition ${
                  calcMode === 'actual_wear'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-950 dark:text-sky-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Días de uso real</span>
                  {calcMode === 'actual_wear' && <Check className="w-4 h-4 text-sky-500" />}
                </div>
                <p className="text-[11px] opacity-75 mt-0.5">
                  Solo descuenta días cuando registras "Me los puse". Ideal si alternas con anteojos.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCalcMode('calendar_days')}
                className={`p-3 rounded-2xl border text-left transition ${
                  calcMode === 'calendar_days'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-950 dark:text-sky-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Días calendario corridos</span>
                  {calcMode === 'calendar_days' && <Check className="w-4 h-4 text-sky-500" />}
                </div>
                <p className="text-[11px] opacity-75 mt-0.5">
                  Descuenta 1 día cada 24 horas desde que abriste el blíster (criterio clínico estricto).
                </p>
              </button>
            </div>
          </div>

          {/* Model Name and Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Nombre del modelo:
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Acuvue Oasys"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Marca / Fabricante:
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Ej: Johnson & Johnson"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Prescription Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowRx(!showRx)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showRx ? 'Ocultar graduación oftálmica' : '+ Añadir graduación (OD / OS)'}</span>
            </button>

            {showRx && (
              <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      OD (Ojo Derecho) Esfera:
                    </span>
                    <input
                      type="text"
                      value={odSphere}
                      onChange={e => setOdSphere(e.target.value)}
                      placeholder="-2.50"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      OS (Ojo Izquierdo) Esfera:
                    </span>
                    <input
                      type="text"
                      value={osSphere}
                      onChange={e => setOsSphere(e.target.value)}
                      placeholder="-2.75"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Curva Base (BC):</span>
                    <input
                      type="text"
                      value={baseCurve}
                      onChange={e => setBaseCurve(e.target.value)}
                      placeholder="8.5"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Diámetro (DIA):</span>
                    <input
                      type="text"
                      value={diameter}
                      onChange={e => setDiameter(e.target.value)}
                      placeholder="14.2"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md transition"
            >
              {isNewPairMode ? 'Iniciar Nuevo Par' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

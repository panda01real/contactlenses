import React from 'react';
import { X, HeartPulse, Droplets, AlertOctagon, Sparkles, ShieldCheck, Moon, Clock } from 'lucide-react';

export const EyeHealthGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 my-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Guía de Salud Ocular y Cuidados
              </h3>
              <p className="text-xs text-slate-500">Recomendaciones clínicas para usuarios de lentes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-xs mb-1">
              <Moon className="w-4 h-4 text-amber-600" />
              <span>1. Nunca duermas con lentes puestos</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Dormir con lentes reduce drásticamente el oxígeno que llega a la córnea y multiplica por 6 a 8 el riesgo de queratitis infecciosa bacteriana severa. Retíralos siempre antes de dormir.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40">
            <div className="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-300 text-xs mb-1">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>2. Cero agua corriente (del grifo)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              El agua de red contiene microorganismos como <em>Acanthamoeba</em>, parásito capaz de causar infecciones graves en la córnea. Lava tus manos con jabón, sécalas bien con toalla limpia y usa solo solución multipropósito estéril.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-xs mb-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>3. Cambia el estuche porta-lentes cada 3 meses (90 días)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Incluso desinfectándolo a diario, en el plástico del estuche se acumula un biofilm microscópico. Renuévalo periódicamente junto con tu solución líquida fresca.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300 text-xs mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>4. La regla 20-20-20 para pantallas</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Al mirar el celular Samsung o la computadora parpadeamos hasta un 50% menos. Cada 20 minutos de pantalla, mira un objeto a 6 metros (20 pies) de distancia durante 20 segundos para hidratar la superficie ocular.
            </p>
          </div>

          {/* Rule 5: Signs to stop */}
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
            <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-300 text-xs mb-1">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Signos de alerta (¡Retirar de inmediato!):</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Si sientes dolor ocular, ojo rojo persistente, visión borrosa súbita o sensibilidad excesiva a la luz (fotofobia), quítate los lentes de inmediato, usa tus anteojos y consulta a tu oftalmólogo.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

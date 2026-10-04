import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed in standalone mode, show verified checkmark or hide
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Instalada en tu Samsung S23 FE</span>
      </div>
    );
  }

  return (
    <>
      {isInstallable ? (
        <button
          onClick={install}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium shadow-md shadow-sky-500/20 active:scale-95 transition-all ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
          }`}
        >
          <Download className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Instalar en Android</span>
        </button>
      ) : (
        <button
          onClick={() => setShowGuide(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 font-medium active:scale-95 transition-all ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-xs'
          }`}
          title="Cómo instalar en Samsung Galaxy S23 FE"
        >
          <Smartphone className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{compact ? 'Instalar' : 'Instalar en S23 FE'}</span>
        </button>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Instalar en Samsung Galaxy S23 FE
                  </h3>
                  <p className="text-xs text-slate-500">Acceso directo como app nativa</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                <span className="font-semibold text-sky-800 dark:text-sky-300 block mb-1">
                  🌐 En Google Chrome (Android):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Toca el menú de los <strong>3 puntos verticales (⋮)</strong> en la esquina superior derecha.</li>
                  <li>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla de inicio"</strong>.</li>
                  <li>Confirma en "Instalar". ¡Aparecerá en tu cajón de aplicaciones de Samsung One UI!</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <span className="font-semibold text-indigo-800 dark:text-indigo-300 block mb-1">
                  🌐 En Samsung Internet Browser:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Toca el icono de <strong>menú (≡)</strong> en la barra inferior.</li>
                  <li>Toca el botón <strong>"Añadir página a"</strong>.</li>
                  <li>Elige <strong>"Pantalla de inicio"</strong>.</li>
                </ol>
              </div>

              {isIOS && (
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-xs">
                  <strong>En Safari iOS:</strong> Toca el botón <em>Compartir</em> (rectángulo con flecha) y selecciona <em>"Añadir a pantalla de inicio"</em>.
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium text-sm hover:opacity-95 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

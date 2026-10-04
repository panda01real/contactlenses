import React, { useState } from 'react';
import { Bell, X, Check, Clock, AlertTriangle, ShieldCheck, Moon, Sparkles, Send } from 'lucide-react';
import { NotificationSettings } from '../types';
import {
  getNotificationPermission,
  isNotificationSupported,
  requestNotificationPermission,
  sendLocalNotification,
} from '../services/notifications';

interface NotificationSettingsModalProps {
  settings: NotificationSettings;
  daysRemaining: number;
  pairName: string;
  onSave: (settings: NotificationSettings) => void;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  settings,
  daysRemaining,
  pairName,
  onSave,
  onClose,
}) => {
  const [currentSettings, setCurrentSettings] = useState<NotificationSettings>(settings);
  const [permissionState, setPermissionState] = useState<NotificationPermission>(() =>
    getNotificationPermission()
  );
  const [testSent, setTestSent] = useState(false);

  const supported = isNotificationSupported();

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionState(getNotificationPermission());
    if (granted) {
      setCurrentSettings(prev => ({ ...prev, enabled: true }));
    }
  };

  const handleTestNotification = () => {
    const success = sendLocalNotification('OcuTrack 👁️ ¡Notificación de prueba exitosa!', {
      body: `Tu par "${pairName}" tiene ${daysRemaining} días restantes. Las alertas funcionarán en tu Samsung S23 FE.`,
      tag: 'test-notification',
    });
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Notificaciones y Recordatorios
              </h3>
              <p className="text-xs text-slate-500">Alertas de cambio y registro diario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Estado del permiso en el navegador:
            </span>
            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                permissionState === 'granted'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : permissionState === 'denied'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              }`}
            >
              {permissionState === 'granted'
                ? 'Concedido ✓'
                : permissionState === 'denied'
                ? 'Bloqueado ✕'
                : 'Pendiente ?'}
            </span>
          </div>

          {permissionState !== 'granted' && supported && (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="w-full py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition"
            >
              Habilitar Notificaciones en Android / Samsung S23 FE
            </button>
          )}

          {permissionState === 'granted' && (
            <button
              type="button"
              onClick={handleTestNotification}
              className="w-full py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Probar notificación de prueba ahora</span>
            </button>
          )}

          {testSent && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 text-center font-medium">
              ¡Notificación enviada! Revisa el panel de notificaciones de tu teléfono.
            </p>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Expiration alerts */}
          <div className="flex items-start justify-between p-3 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Alertas de cambio de par
              </span>
              <p className="text-[11px] text-slate-500">
                Avisa cuando queden 3 días, 1 día y cuando el par alcance el límite de duración.
              </p>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.expirationAlerts}
              onChange={e =>
                setCurrentSettings(prev => ({ ...prev, expirationAlerts: e.target.checked }))
              }
              className="mt-1 w-4 h-4 rounded text-sky-500 focus:ring-sky-400"
            />
          </div>

          {/* Daily check-in reminder */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  Recordatorio matutino de registro
                </span>
                <p className="text-[11px] text-slate-500">
                  Pregunta si te pusiste los lentes para no olvidar marcar el día.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentSettings.dailyCheckInReminder}
                onChange={e =>
                  setCurrentSettings(prev => ({ ...prev, dailyCheckInReminder: e.target.checked }))
                }
                className="mt-1 w-4 h-4 rounded text-sky-500 focus:ring-sky-400"
              />
            </div>

            {currentSettings.dailyCheckInReminder && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Hora del recordatorio:</span>
                <input
                  type="time"
                  value={currentSettings.dailyCheckInTime}
                  onChange={e =>
                    setCurrentSettings(prev => ({ ...prev, dailyCheckInTime: e.target.value }))
                  }
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
            )}
          </div>

          {/* Evening removal reminder */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  Recordatorio nocturno: Quitarse los lentes
                </span>
                <p className="text-[11px] text-slate-500">
                  Crucial para la salud de tus ojos: avisa antes de ir a dormir.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentSettings.eveningRemovalReminder}
                onChange={e =>
                  setCurrentSettings(prev => ({
                    ...prev,
                    eveningRemovalReminder: e.target.checked,
                  }))
                }
                className="mt-1 w-4 h-4 rounded text-sky-500 focus:ring-sky-400"
              />
            </div>

            {currentSettings.eveningRemovalReminder && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Hora de retiro:</span>
                <input
                  type="time"
                  value={currentSettings.eveningRemovalTime}
                  onChange={e =>
                    setCurrentSettings(prev => ({ ...prev, eveningRemovalTime: e.target.value }))
                  }
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
            )}
          </div>

          {/* Lens Case Replacement Reminder */}
          <div className="flex items-start justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Recordatorio de cambiar el estuche (cada 90 días)
              </span>
              <p className="text-[11px] text-slate-500">
                Evita la acumulación de biopelículas bacterianas en el porta-lentes.
              </p>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.caseChangeReminder}
              onChange={e =>
                setCurrentSettings(prev => ({ ...prev, caseChangeReminder: e.target.checked }))
              }
              className="mt-1 w-4 h-4 rounded text-sky-500 focus:ring-sky-400"
            />
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
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

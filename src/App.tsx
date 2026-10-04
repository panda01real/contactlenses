import React, { useState, useEffect } from 'react';
import {
  Eye,
  Calendar as CalendarIcon,
  Smartphone,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Vibrate,
  History,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { AppSettings, DailyLog, LensPair, NotificationSettings } from './types';
import { formatDateKey, storageService } from './services/storage';
import { hapticFeedback } from './services/haptics';
import {
  getNotificationPermission,
  triggerExpirationAlertNotification,
  triggerWearReminderNotification,
} from './services/notifications';
import { TodayCheckInCard } from './components/TodayCheckInCard';
import { LensStatusCard } from './components/LensStatusCard';
import { SamsungWidgetSimulator } from './components/SamsungWidgetSimulator';
import { CalendarView } from './components/CalendarView';
import { PairConfigModal } from './components/PairConfigModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { EditDayModal } from './components/EditDayModal';
import { HistoryModal } from './components/HistoryModal';
import { EyeHealthGuideModal } from './components/EyeHealthGuideModal';
import { SamsungFrame } from './components/SamsungFrame';
import { PWAInstallButton } from './components/PWAInstallButton';
import { GitHubApkModal } from './components/GitHubApkModal';
import { Github } from 'lucide-react';

type ActiveTab = 'today' | 'widget' | 'calendar' | 'settings';

export default function App() {
  const [activePair, setActivePair] = useState<LensPair>(() => storageService.getActivePair());
  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => storageService.getDailyLogs());
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() =>
    storageService.getNotificationSettings()
  );
  const [appSettings, setAppSettings] = useState<AppSettings>(() =>
    storageService.getAppSettings()
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('today');

  // Modals state
  const [showPairModal, setShowPairModal] = useState(false);
  const [isNewPairMode, setIsNewPairMode] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHealthGuide, setShowHealthGuide] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  const todayKey = formatDateKey();
  const todayLog = logs[todayKey];

  // Derived statistics
  const stats = React.useMemo(() => {
    return storageService.calculateActivePairStats(activePair, logs);
  }, [activePair, logs]);

  // Periodic notification check when active
  useEffect(() => {
    if (!notifSettings.enabled) return;

    // Check expiration reminder
    if (notifSettings.expirationAlerts) {
      if (stats.daysRemaining <= 3) {
        // Send alert if not already alerted today
        const lastAlertKey = 'ocutrack_last_alert_' + todayKey;
        if (!localStorage.getItem(lastAlertKey)) {
          triggerExpirationAlertNotification(stats.daysRemaining, activePair.name);
          localStorage.setItem(lastAlertKey, 'true');
        }
      }
    }
  }, [notifSettings, stats.daysRemaining, activePair.name, todayKey]);

  // Daily log action
  const handleLogWear = (worn: boolean, hours?: number, notes?: string) => {
    const updated = storageService.setDailyLog(todayKey, worn, hours, notes);
    setLogs(prev => ({ ...prev, [todayKey]: updated }));
  };

  const handleClearLog = () => {
    storageService.deleteDailyLog(todayKey);
    setLogs(prev => {
      const next = { ...prev };
      delete next[todayKey];
      return next;
    });
  };

  // Toggle calculation mode directly
  const handleToggleCalcMode = () => {
    const newMode = activePair.calculationMode === 'actual_wear' ? 'calendar_days' : 'actual_wear';
    const updated: LensPair = {
      ...activePair,
      calculationMode: newMode,
    };
    storageService.saveActivePair(updated);
    setActivePair(updated);
    hapticFeedback('tap', appSettings.soundEnabled, appSettings.vibrationEnabled);
  };

  // Save pair configuration (new or edit)
  const handleSavePairConfig = (pairData: Partial<LensPair>, isNew: boolean) => {
    if (isNew) {
      const created = storageService.archiveCurrentAndStartNew(
        pairData as Omit<LensPair, 'id' | 'status'>
      );
      setActivePair(created);
    } else {
      const updated: LensPair = {
        ...activePair,
        ...pairData,
      };
      storageService.saveActivePair(updated);
      setActivePair(updated);
    }
    hapticFeedback('celebrate', appSettings.soundEnabled, appSettings.vibrationEnabled);
  };

  // Save day edit from calendar
  const handleSaveDayEdit = (dateKey: string, worn: boolean, hours?: number, notes?: string) => {
    const updated = storageService.setDailyLog(dateKey, worn, hours, notes);
    setLogs(prev => ({ ...prev, [dateKey]: updated }));
    hapticFeedback('tap', appSettings.soundEnabled, appSettings.vibrationEnabled);
  };

  const handleDeleteDayLog = (dateKey: string) => {
    storageService.deleteDailyLog(dateKey);
    setLogs(prev => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
    hapticFeedback('not_wear', appSettings.soundEnabled, appSettings.vibrationEnabled);
  };

  // Sound toggle
  const toggleSound = () => {
    const next = !appSettings.soundEnabled;
    const updated = { ...appSettings, soundEnabled: next };
    storageService.saveAppSettings(updated);
    setAppSettings(updated);
  };

  // Frame toggle
  const toggleDeviceFrame = () => {
    const next = !appSettings.showSamsungDeviceFrame;
    const updated = { ...appSettings, showSamsungDeviceFrame: next };
    storageService.saveAppSettings(updated);
    setAppSettings(updated);
  };

  return (
    <SamsungFrame
      enabled={appSettings.showSamsungDeviceFrame}
      onToggleFrame={toggleDeviceFrame}
    >
      <div className="min-h-screen flex flex-col justify-between max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-24 text-slate-800 dark:text-slate-100">
        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Header Bar */}
          <header className="flex items-center justify-between pt-1 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                    OcuTrack
                  </h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    S23 FE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Control de lentes de contacto
                </p>
              </div>
            </div>

            {/* Top Right Utilities */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={appSettings.soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
              >
                {appSettings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-sky-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => setShowNotifModal(true)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Configuración de notificaciones"
              >
                <Bell className="w-4 h-4" />
                {notifSettings.enabled && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              <button
                onClick={() => setShowGitHubModal(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Subir a GitHub y Descargar APK"
              >
                <Github className="w-4 h-4" />
              </button>

              <button
                onClick={toggleDeviceFrame}
                className={`p-2 rounded-xl text-xs font-semibold transition ${
                  appSettings.showSamsungDeviceFrame
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Alternar marco Samsung Galaxy S23 FE"
              >
                <Smartphone className="w-4 h-4" />
              </button>

              <PWAInstallButton compact />
            </div>
          </header>

          {/* Quick Expiration Warning Banner if Urgent */}
          {stats.isExpired && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-800 dark:text-rose-200 animate-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>¡Tus lentes han vencido!</strong> ({stats.daysUsed} días de {activePair.totalLifespanDays}). Reemplázalos para cuidar tus ojos.
                </span>
              </div>
              <button
                onClick={() => {
                  setIsNewPairMode(true);
                  setShowPairModal(true);
                }}
                className="shrink-0 ml-2 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Cambiar par
              </button>
            </div>
          )}

          {/* TAB 1: HOY (Check-in & Status) */}
          {activeTab === 'today' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Daily Check-In Hero Card */}
              <TodayCheckInCard
                todayLog={todayLog}
                todayDateKey={todayKey}
                soundEnabled={appSettings.soundEnabled}
                vibrationEnabled={appSettings.vibrationEnabled}
                onLogWear={handleLogWear}
                onClearLog={handleClearLog}
              />

              {/* Lens Lifespan & Days Remaining Card */}
              <LensStatusCard
                activePair={activePair}
                stats={stats}
                onOpenNewPairModal={() => {
                  setIsNewPairMode(true);
                  setShowPairModal(true);
                }}
                onEditPairModal={() => {
                  setIsNewPairMode(false);
                  setShowPairModal(true);
                }}
                onToggleCalcMode={handleToggleCalcMode}
              />

              {/* Quick Health Insight / Eye Tips Banner */}
              <div
                onClick={() => setShowHealthGuide(true)}
                className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-indigo-500/10 border border-sky-200/60 dark:border-sky-800/40 flex items-center justify-between text-xs hover:border-sky-400 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs">
                    <HeartPulse className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">
                      Guía médica: Cuidados y regla 20-20-20
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Reglas para no irritar tus ojos y mantener tus lentes hidratados.
                    </span>
                  </div>
                </div>
                <span className="text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 group-hover:translate-x-1 transition-transform">
                  Ver guía →
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: WIDGET (Samsung Galaxy One UI Simulator) */}
          {activeTab === 'widget' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Widget para Samsung Galaxy S23 FE
                </h2>
                <p className="text-xs text-slate-500">
                  Simula la apariencia exacta de los widgets de One UI 6 para tu pantalla de inicio.
                </p>
              </div>

              <SamsungWidgetSimulator
                activePair={activePair}
                todayLog={todayLog}
                stats={stats}
                soundEnabled={appSettings.soundEnabled}
                vibrationEnabled={appSettings.vibrationEnabled}
                onToggleToday={worn => handleLogWear(worn)}
                onOpenNewPairModal={() => {
                  setIsNewPairMode(true);
                  setShowPairModal(true);
                }}
              />

              {/* Samsung S23 FE Installation instructions */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-500" />
                  ¿Cómo tener el acceso directo y widget en tu S23 FE?
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li>
                    Abre esta app en <strong>Google Chrome</strong> o <strong>Samsung Internet</strong> desde tu Samsung Galaxy S23 FE.
                  </li>
                  <li>
                    Pulsa el botón <strong>"Instalar en Android"</strong> en la esquina superior o en el menú del navegador ⋮ &gt; <em>"Añadir a la pantalla de inicio"</em>.
                  </li>
                  <li>
                    La aplicación se instalará como una App nativa con su propio ícono de lente de contacto, sin barras de navegación del navegador.
                  </li>
                  <li>
                    ¡Al mantener presionado el ícono en tu pantalla de inicio podrás acceder a los accesos directos rápidos de registro diario!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: CALENDARIO (Monthly grid & history) */}
          {activeTab === 'calendar' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Historial de Uso
                  </h2>
                  <p className="text-xs text-slate-500">
                    Calendario mensual de días usados y días de descanso
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
                >
                  <History className="w-3.5 h-3.5 text-sky-500" />
                  <span>Pares anteriores</span>
                </button>
              </div>

              <CalendarView
                logs={logs}
                activePairStartDate={activePair.startDate}
                onSelectDate={dateKey => setSelectedCalendarDate(dateKey)}
              />

              {/* Quick stats summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Días con lentes (Total):</span>
                  <span className="text-xl font-black text-sky-600 dark:text-sky-400">
                    {stats.wornCount} días
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Días restantes del par:</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {stats.daysRemaining} días
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[11px]">Tiempo desde apertura:</span>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-200">
                    {stats.calendarDaysElapsed} días
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AJUSTES (Settings & Lens Pair Management) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Ajustes y Configuración
                </h2>
                <p className="text-xs text-slate-500">
                  Preferencias del par de lentes, notificaciones y salud
                </p>
              </div>

              {/* Section: Par Actual */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Par de Lentes Activo
                  </h3>
                  <button
                    onClick={() => {
                      setIsNewPairMode(false);
                      setShowPairModal(true);
                    }}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Editar datos
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="font-bold">{activePair.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duración:</span>
                    <span className="font-bold">{activePair.totalLifespanDays} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modo de cálculo:</span>
                    <span className="font-bold">
                      {activePair.calculationMode === 'actual_wear'
                        ? 'Días de uso real'
                        : 'Días calendario'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fecha de apertura:</span>
                    <span className="font-mono">{activePair.startDate}</span>
                  </div>
                  {activePair.solutionBrand && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Solución:</span>
                      <span>{activePair.solutionBrand}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsNewPairMode(true);
                      setShowPairModal(true);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition"
                  >
                    Renovar / Abrir nuevo par
                  </button>

                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                  >
                    Historial
                  </button>
                </div>
              </div>

              {/* Section: Notificaciones */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-sky-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Notificaciones y Alarmas
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      notifSettings.enabled
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}
                  >
                    {notifSettings.enabled ? 'Activadas' : 'Desactivadas'}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Configura recordatorios matutinos ("¿Te pusiste los lentes?"), alertas de retiro antes de dormir y aviso cuando queden pocos días para renovar el par.
                </p>

                <button
                  onClick={() => setShowNotifModal(true)}
                  className="w-full py-2.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 font-semibold text-xs transition"
                >
                  Gestionar horas y recordatorios
                </button>
              </div>

              {/* Section: Interfaz & Sensaciones */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Retroalimentación y Dispositivo
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">Efectos de sonido (Gota de agua)</span>
                      <span className="text-[11px] text-slate-500">Tono sintético al marcar el uso</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.soundEnabled}
                      onChange={toggleSound}
                      className="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"
                    />
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">Vibración háptica One UI</span>
                      <span className="text-[11px] text-slate-500">Respuesta táctil del motor de vibración</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.vibrationEnabled}
                      onChange={() => {
                        const next = !appSettings.vibrationEnabled;
                        const updated = { ...appSettings, vibrationEnabled: next };
                        storageService.saveAppSettings(updated);
                        setAppSettings(updated);
                        if (next) hapticFeedback('tap', false, true);
                      }}
                      className="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"
                    />
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">Marco Samsung Galaxy S23 FE</span>
                      <span className="text-[11px] text-slate-500">Muestra el chasis y barra One UI</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.showSamsungDeviceFrame}
                      onChange={toggleDeviceFrame}
                      className="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"
                    />
                  </div>
                </div>
              </div>

              {/* GitHub & Generar APK button */}
              <button
                onClick={() => setShowGitHubModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Github className="w-4 h-4 text-sky-400" />
                <span>Subir a mi GitHub & Generar archivo .APK</span>
              </button>

              {/* Salud Ocular Link */}
              <button
                onClick={() => setShowHealthGuide(true)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>Abrir Guía Médica y Cuidados Oftálmicos</span>
              </button>
            </div>
          )}
        </div>

        {/* Samsung One UI Bottom Navigation Bar (Thumb Friendly) */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-6 py-2.5 max-w-2xl mx-auto shadow-lg">
          <div className="grid grid-cols-4 gap-1">
            {/* Tab: Hoy */}
            <button
              onClick={() => {
                setActiveTab('today');
                hapticFeedback('tap', appSettings.soundEnabled, appSettings.vibrationEnabled);
              }}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
                activeTab === 'today'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'today'
                    ? 'bg-sky-100 dark:bg-sky-950/80'
                    : 'bg-transparent'
                }`}
              >
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">Hoy</span>
            </button>

            {/* Tab: Widget */}
            <button
              onClick={() => {
                setActiveTab('widget');
                hapticFeedback('tap', appSettings.soundEnabled, appSettings.vibrationEnabled);
              }}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
                activeTab === 'widget'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'widget'
                    ? 'bg-sky-100 dark:bg-sky-950/80'
                    : 'bg-transparent'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">Widget</span>
            </button>

            {/* Tab: Calendario */}
            <button
              onClick={() => {
                setActiveTab('calendar');
                hapticFeedback('tap', appSettings.soundEnabled, appSettings.vibrationEnabled);
              }}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
                activeTab === 'calendar'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-sky-100 dark:bg-sky-950/80'
                    : 'bg-transparent'
                }`}
              >
                <CalendarIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">Calendario</span>
            </button>

            {/* Tab: Ajustes */}
            <button
              onClick={() => {
                setActiveTab('settings');
                hapticFeedback('tap', appSettings.soundEnabled, appSettings.vibrationEnabled);
              }}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
                activeTab === 'settings'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  activeTab === 'settings'
                    ? 'bg-sky-100 dark:bg-sky-950/80'
                    : 'bg-transparent'
                }`}
              >
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">Ajustes</span>
            </button>
          </div>
        </nav>

        {/* Modals */}
        {showPairModal && (
          <PairConfigModal
            currentPair={activePair}
            isNewPairMode={isNewPairMode}
            onSave={handleSavePairConfig}
            onClose={() => setShowPairModal(false)}
          />
        )}

        {showNotifModal && (
          <NotificationSettingsModal
            settings={notifSettings}
            daysRemaining={stats.daysRemaining}
            pairName={activePair.name}
            onSave={updated => {
              storageService.saveNotificationSettings(updated);
              setNotifSettings(updated);
            }}
            onClose={() => setShowNotifModal(false)}
          />
        )}

        {selectedCalendarDate && (
          <EditDayModal
            dateKey={selectedCalendarDate}
            existingLog={logs[selectedCalendarDate]}
            onSave={handleSaveDayEdit}
            onDelete={handleDeleteDayLog}
            onClose={() => setSelectedCalendarDate(null)}
          />
        )}

        {showHistoryModal && (
          <HistoryModal
            history={storageService.getHistoryPairs()}
            onImportSuccess={() => {
              setActivePair(storageService.getActivePair());
              setLogs(storageService.getDailyLogs());
              setNotifSettings(storageService.getNotificationSettings());
              setAppSettings(storageService.getAppSettings());
            }}
            onClose={() => setShowHistoryModal(false)}
          />
        )}

        {showHealthGuide && (
          <EyeHealthGuideModal onClose={() => setShowHealthGuide(false)} />
        )}

        {showGitHubModal && (
          <GitHubApkModal onClose={() => setShowGitHubModal(false)} />
        )}
      </div>
    </SamsungFrame>
  );
}

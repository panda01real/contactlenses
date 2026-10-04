import { AppSettings, DailyLog, LensPair, NotificationSettings } from '../types';

const STORAGE_KEYS = {
  ACTIVE_PAIR: 'ocutrack_active_pair',
  HISTORY_PAIRS: 'ocutrack_history_pairs',
  DAILY_LOGS: 'ocutrack_daily_logs',
  NOTIFICATION_SETTINGS: 'ocutrack_notification_settings',
  APP_SETTINGS: 'ocutrack_app_settings',
  INITIALIZED: 'ocutrack_initialized_v1',
};

// Helper to format date as YYYY-MM-DD using local time
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatTimeHHMM(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}

// Generate realistic initial seed if empty
function initializeSeedData() {
  if (typeof window === 'undefined') return;

  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (isInitialized) return;

  const today = new Date();
  // Active pair started 9 days ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 9);

  const initialPair: LensPair = {
    id: 'pair-initial-1',
    name: 'Acuvue Oasys HydraLuxe',
    brand: 'Johnson & Johnson',
    durationType: 'monthly',
    totalLifespanDays: 30,
    calculationMode: 'actual_wear', // Días de uso real
    startDate: formatDateKey(startDate),
    status: 'active',
    notes: 'Lentes mensuales con filtro UV. Solución Renu Fresh.',
    rightEye: {
      sphere: '-2.50',
      baseCurve: '8.5',
      diameter: '14.3',
    },
    leftEye: {
      sphere: '-2.75',
      baseCurve: '8.5',
      diameter: '14.3',
    },
    solutionBrand: 'Bausch + Lomb ReNu MultiPlus',
    caseLastReplacedDate: formatDateKey(startDate),
  };

  // Seed previous days logs (some worn, some rest days)
  const initialLogs: Record<string, DailyLog> = {};
  for (let i = 9; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = formatDateKey(d);
    // Let's say out of 9 past days, worn 7 days, 2 rest days
    const isRest = i === 4 || i === 8;
    initialLogs[dateKey] = {
      date: dateKey,
      worn: !isRest,
      timestamp: isRest ? '10:00' : '08:15',
      hoursWorn: isRest ? 0 : 9,
      lensPairId: initialPair.id,
      notes: isRest ? 'Día de descanso con anteojos' : undefined,
    };
  }

  // An archived previous pair for history demonstration
  const prevStart = new Date(today);
  prevStart.setDate(today.getDate() - 42);
  const prevEnd = new Date(today);
  prevEnd.setDate(today.getDate() - 10);

  const archivedPair: LensPair = {
    id: 'pair-prev-0',
    name: 'Biofinity Mensuales',
    brand: 'CooperVision',
    durationType: 'monthly',
    totalLifespanDays: 30,
    calculationMode: 'actual_wear',
    startDate: formatDateKey(prevStart),
    status: 'archived',
    archivedDate: formatDateKey(prevEnd),
    notes: 'Completados 30 días de uso. Muy cómodos.',
  };

  localStorage.setItem(STORAGE_KEYS.ACTIVE_PAIR, JSON.stringify(initialPair));
  localStorage.setItem(STORAGE_KEYS.HISTORY_PAIRS, JSON.stringify([archivedPair]));
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(initialLogs));
  localStorage.setItem(
    STORAGE_KEYS.NOTIFICATION_SETTINGS,
    JSON.stringify({
      enabled: false,
      dailyCheckInReminder: true,
      dailyCheckInTime: '09:00',
      eveningRemovalReminder: true,
      eveningRemovalTime: '22:00',
      expirationAlerts: true,
      caseChangeReminder: true,
    } as NotificationSettings)
  );
  localStorage.setItem(
    STORAGE_KEYS.APP_SETTINGS,
    JSON.stringify({
      soundEnabled: true,
      vibrationEnabled: true,
      showSamsungDeviceFrame: false,
      userName: 'Marcos',
    } as AppSettings)
  );
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

// Call seed once on load
initializeSeedData();

export const storageService = {
  getActivePair(): LensPair {
    initializeSeedData();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_PAIR);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    // Fallback default
    return {
      id: 'default-pair',
      name: 'Mis Lentes Mensuales',
      brand: 'Genérica',
      durationType: 'monthly',
      totalLifespanDays: 30,
      calculationMode: 'actual_wear',
      startDate: formatDateKey(),
      status: 'active',
    };
  },

  saveActivePair(pair: LensPair) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PAIR, JSON.stringify(pair));
  },

  archiveCurrentAndStartNew(newPair: Omit<LensPair, 'id' | 'status'>, notesOnArchived?: string): LensPair {
    const current = this.getActivePair();
    const updatedArchived: LensPair = {
      ...current,
      status: 'archived',
      archivedDate: formatDateKey(),
      notes: notesOnArchived || current.notes,
    };

    const history = this.getHistoryPairs();
    history.unshift(updatedArchived);
    localStorage.setItem(STORAGE_KEYS.HISTORY_PAIRS, JSON.stringify(history));

    const brandNew: LensPair = {
      ...newPair,
      id: 'pair-' + Date.now(),
      status: 'active',
    };
    this.saveActivePair(brandNew);
    return brandNew;
  },

  getHistoryPairs(): LensPair[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY_PAIRS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  getDailyLogs(): Record<string, DailyLog> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {};
  },

  getLogForDate(dateKey: string): DailyLog | undefined {
    const logs = this.getDailyLogs();
    return logs[dateKey];
  },

  setDailyLog(dateKey: string, worn: boolean, hoursWorn?: number, notes?: string): DailyLog {
    const logs = this.getDailyLogs();
    const activePair = this.getActivePair();
    const existing = logs[dateKey];

    const updatedLog: DailyLog = {
      date: dateKey,
      worn,
      timestamp: existing?.timestamp || formatTimeHHMM(),
      hoursWorn: hoursWorn !== undefined ? hoursWorn : (worn ? (existing?.hoursWorn || 8) : 0),
      notes: notes !== undefined ? notes : existing?.notes,
      lensPairId: existing?.lensPairId || activePair.id,
    };

    logs[dateKey] = updatedLog;
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    return updatedLog;
  },

  deleteDailyLog(dateKey: string) {
    const logs = this.getDailyLogs();
    delete logs[dateKey];
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  },

  getNotificationSettings(): NotificationSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      enabled: false,
      dailyCheckInReminder: true,
      dailyCheckInTime: '09:00',
      eveningRemovalReminder: true,
      eveningRemovalTime: '22:00',
      expirationAlerts: true,
      caseChangeReminder: true,
    };
  },

  saveNotificationSettings(settings: NotificationSettings) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  },

  getAppSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      soundEnabled: true,
      vibrationEnabled: true,
      showSamsungDeviceFrame: false,
      userName: '',
    };
  },

  saveAppSettings(settings: AppSettings) {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  },

  // Calculate statistics for the active pair
  calculateActivePairStats(pair: LensPair, logs: Record<string, DailyLog>) {
    // 1. Days worn for this pair
    const logsList = Object.values(logs);
    const wornLogs = logsList.filter(l => l.lensPairId === pair.id && l.worn);
    const wornCount = wornLogs.length;

    // 2. Calendar days elapsed since start date
    const [sy, sm, sd] = pair.startDate.split('-').map(Number);
    const startObj = new Date(sy, sm - 1, sd);
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const diffTime = Math.max(0, todayObj.getTime() - startObj.getTime());
    const calendarDaysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start day

    // 3. Days used based on calculation mode
    const daysUsed = pair.calculationMode === 'actual_wear' ? wornCount : calendarDaysElapsed;
    const daysRemaining = Math.max(0, pair.totalLifespanDays - daysUsed);
    const isExpired = daysUsed >= pair.totalLifespanDays;
    const progressPercent = Math.min(100, Math.round((daysUsed / pair.totalLifespanDays) * 100));

    // 4. Lens case age (recommended replace every 90 days)
    let caseDaysElapsed = calendarDaysElapsed;
    if (pair.caseLastReplacedDate) {
      const [cy, cm, cd] = pair.caseLastReplacedDate.split('-').map(Number);
      const caseObj = new Date(cy, cm - 1, cd);
      const cDiff = Math.max(0, todayObj.getTime() - caseObj.getTime());
      caseDaysElapsed = Math.floor(cDiff / (1000 * 60 * 60 * 24)) + 1;
    }

    return {
      wornCount,
      calendarDaysElapsed,
      daysUsed,
      daysRemaining,
      isExpired,
      progressPercent,
      caseDaysElapsed,
    };
  },

  exportBackup(): string {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      activePair: this.getActivePair(),
      history: this.getHistoryPairs(),
      logs: this.getDailyLogs(),
      notifications: this.getNotificationSettings(),
      settings: this.getAppSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.activePair) localStorage.setItem(STORAGE_KEYS.ACTIVE_PAIR, JSON.stringify(data.activePair));
      if (data.history) localStorage.setItem(STORAGE_KEYS.HISTORY_PAIRS, JSON.stringify(data.history));
      if (data.logs) localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(data.logs));
      if (data.notifications) localStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(data.notifications));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(data.settings));
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },
};

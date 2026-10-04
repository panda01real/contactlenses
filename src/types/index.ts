export type LensDurationType = 'daily' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';

export type CalculationMode = 'actual_wear' | 'calendar_days';

export interface EyePrescription {
  sphere: string;       // e.g. -2.75
  cylinder?: string;    // e.g. -0.75
  axis?: string;        // e.g. 180°
  baseCurve?: string;   // e.g. 8.6
  diameter?: string;    // e.g. 14.2
}

export interface LensPair {
  id: string;
  name: string;                // e.g. "Acuvue Oasys HydraLuxe"
  brand: string;               // e.g. "Johnson & Johnson"
  durationType: LensDurationType;
  totalLifespanDays: number;   // e.g. 30 days
  calculationMode: CalculationMode; // 'actual_wear' (solo días usados) or 'calendar_days' (días corridos)
  startDate: string;           // YYYY-MM-DD
  status: 'active' | 'archived';
  archivedDate?: string;
  notes?: string;
  rightEye?: EyePrescription;
  leftEye?: EyePrescription;
  solutionBrand?: string;
  caseLastReplacedDate?: string;
}

export interface DailyLog {
  date: string;         // YYYY-MM-DD
  worn: boolean;        // true = me los puse, false = no me los puse
  timestamp: string;    // HH:mm (e.g. 08:30)
  hoursWorn?: number;   // estimated hours
  notes?: string;
  lensPairId: string;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyCheckInReminder: boolean;
  dailyCheckInTime: string;       // "09:00"
  eveningRemovalReminder: boolean; // "¿Te quitaste los lentes?"
  eveningRemovalTime: string;     // "22:00"
  expirationAlerts: boolean;      // Alerta de cambio cuando queden 3, 1 y 0 días
  caseChangeReminder: boolean;    // Recordar cambiar el estuche cada 90 días
}

export interface AppSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showSamsungDeviceFrame: boolean;
  userName?: string;
}

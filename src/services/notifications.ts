// Browser Notifications API service for Android / Samsung S23 FE and desktop

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export function sendLocalNotification(title: string, options?: NotificationOptions): boolean {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const defaultOptions: NotificationOptions = {
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      tag: 'ocutrack-notification',
      ...options,
    };

    new Notification(title, defaultOptions);
    return true;
  } catch (err) {
    console.error('Failed to trigger notification:', err);
    return false;
  }
}

export function triggerWearReminderNotification(): boolean {
  return sendLocalNotification('OcuTrack 👁️ ¿Te pusiste los lentes hoy?', {
    body: 'Toca aquí para registrar tu uso del día y mantener el conteo exacto.',
    tag: 'ocutrack-daily-checkin',
  });
}

export function triggerEveningRemovalNotification(): boolean {
  return sendLocalNotification('OcuTrack 🌙 Hora de quitarse los lentes', {
    body: 'Recuerda retirar y desinfectar tus lentes de contacto antes de dormir para cuidar tu córnea.',
    tag: 'ocutrack-evening-removal',
  });
}

export function triggerExpirationAlertNotification(daysRemaining: number, pairName: string): boolean {
  if (daysRemaining <= 0) {
    return sendLocalNotification('⚠️ ¡Par de lentes vencido!', {
      body: `Tu par "${pairName}" ha alcanzado el límite de días recomendados. Cámbialo hoy por uno nuevo para evitar infecciones.`,
      tag: 'ocutrack-expired',
    });
  }

  return sendLocalNotification(`🔔 Recordatorio de cambio: ${daysRemaining} día(s) restante(s)`, {
    body: `Tu par "${pairName}" vencerá pronto (${daysRemaining} días). Prepara tu próximo blister de repuesto.`,
    tag: 'ocutrack-expiring-soon',
  });
}

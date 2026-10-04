import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { DailyLog } from '../types';
import { formatDateKey } from '../services/storage';

interface CalendarViewProps {
  logs: Record<string, DailyLog>;
  activePairStartDate: string;
  onSelectDate: (dateKey: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  activePairStartDate,
  onSelectDate,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayKey = formatDateKey(new Date());

  // Month title in Spanish
  const monthTitle = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week: 0 is Sunday, convert so Monday is 0, Sunday is 6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const totalDays = lastDayOfMonth.getDate();
    const days: Array<{
      dateKey: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      log?: DailyLog;
    }> = [];

    // Previous month padding
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDate - i;
      const d = new Date(year, month - 1, dayNum);
      const k = formatDateKey(d);
      days.push({
        dateKey: k,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: k === todayKey,
        log: logs[k],
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const k = formatDateKey(dateObj);
      days.push({
        dateKey: k,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: k === todayKey,
        log: logs[k],
      });
    }

    // Next month padding to fill grid
    const remainingSlots = 35 - days.length;
    const finalSlots = remainingSlots < 0 ? 42 - days.length : remainingSlots;
    for (let i = 1; i <= finalSlots; i++) {
      const d = new Date(year, month + 1, i);
      const k = formatDateKey(d);
      days.push({
        dateKey: k,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: k === todayKey,
        log: logs[k],
      });
    }

    return days;
  }, [year, month, logs, todayKey]);

  // Monthly stats
  const currentMonthLogs = Object.values(logs).filter(log => {
    const [ly, lm] = log.date.split('-').map(Number);
    return ly === year && lm === month + 1;
  });
  const daysWornThisMonth = currentMonthLogs.filter(l => l.worn).length;
  const daysRestThisMonth = currentMonthLogs.filter(l => !l.worn).length;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-sky-500" />
          <h3 className="font-extrabold text-base capitalize text-slate-900 dark:text-white">
            {monthTitle}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map(item => {
          const isWorn = item.log?.worn === true;
          const isRest = item.log?.worn === false;
          const hasLog = item.log !== undefined;

          return (
            <button
              key={item.dateKey}
              onClick={() => onSelectDate(item.dateKey)}
              className={`relative h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                !item.isCurrentMonth
                  ? 'opacity-30'
                  : item.isToday
                  ? 'ring-2 ring-sky-500 dark:ring-sky-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              } ${
                isWorn
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-bold'
                  : isRest
                  ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 font-medium'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
              title={`${item.dateKey}: ${isWorn ? 'Puestos' : isRest ? 'Sin lentes' : 'Sin registro'}`}
            >
              <span className="text-xs leading-none">{item.dayNumber}</span>

              {/* Status indicator dot / badge */}
              <div className="mt-1 flex items-center justify-center">
                {isWorn && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 shadow-xs shadow-sky-500/50" />
                )}
                {isRest && (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
                {!hasLog && item.isCurrentMonth && (
                  <span className="w-1 h-1 rounded-full bg-transparent" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend & Month Stats */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Puestos ({daysWornThisMonth})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>Descanso ({daysRestThisMonth})</span>
          </div>
        </div>

        <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
          Toca un día para editar
        </span>
      </div>
    </div>
  );
};

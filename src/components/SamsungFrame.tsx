import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface SamsungFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onToggleFrame: () => void;
}

export const SamsungFrame: React.FC<SamsungFrameProps> = ({
  children,
  enabled,
  onToggleFrame,
}) => {
  const [timeStr, setTimeStr] = React.useState(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimeStr(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!enabled) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-3 flex flex-col items-center justify-center">
      {/* Frame Mode Switcher at top */}
      <div className="mb-3 flex items-center justify-between w-full max-w-[430px] px-2 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">
          Vista previa Samsung Galaxy S23 FE
        </span>
        <button
          onClick={onToggleFrame}
          className="text-xs text-sky-400 hover:text-sky-300 underline font-medium"
        >
          Pantalla completa
        </button>
      </div>

      {/* Samsung Galaxy S23 FE Aluminum Bezel Chassis */}
      <div className="relative w-full max-w-[420px] rounded-[50px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-slate-600/70">
        {/* Antenna band accents */}
        <div className="absolute -top-1 left-24 w-2 h-1 bg-slate-500 rounded-xs" />
        <div className="absolute -bottom-1 right-24 w-2 h-1 bg-slate-500 rounded-xs" />

        {/* Dynamic AMOLED Screen Area */}
        <div className="relative overflow-hidden rounded-[40px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col h-[860px] shadow-inner">
          {/* Samsung One UI Status Bar */}
          <div className="h-10 px-6 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 select-none z-20 shrink-0 bg-transparent">
            {/* Clock */}
            <span>{timeStr}</span>

            {/* Front Camera Punch-hole (Infinity-O Display) */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border-2 border-slate-800 shadow-inner flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-slate-900" />
            </div>

            {/* Icons: 5G, WiFi, Battery */}
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Signal className="w-3 h-3" />
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Scrollable Body */}
          <div className="flex-1 overflow-y-auto relative no-scrollbar">
            {children}
          </div>

          {/* Samsung Navigation Bar Pill at bottom */}
          <div className="h-4 flex items-center justify-center shrink-0 bg-transparent pb-1">
            <div className="w-28 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0–100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clamped = Math.min(100, Math.max(0, progress));
  const modulesCompleted = Math.round((clamped / 100) * 10);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Progreso del Curso</span>
        <span className="text-sm font-black text-blue-400">{modulesCompleted}/10 Módulos</span>
      </div>
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)',
            boxShadow: clamped > 0 ? '0 0 12px rgba(59,130,246,0.5)' : 'none',
          }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-gray-600">0%</span>
        <span className="text-xs font-bold text-blue-400">{Math.round(clamped)}% completado</span>
        <span className="text-xs text-gray-600">100%</span>
      </div>
    </div>
  );
};

export default ProgressBar;

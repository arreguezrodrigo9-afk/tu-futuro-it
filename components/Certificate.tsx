import React, { useRef } from 'react';
import { User, CourseType } from '../types';
import { COURSES } from '../constants';

interface CertificateProps {
  user: User;
}

const Certificate: React.FC<CertificateProps> = ({ user }) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!user.courseChosen || user.lastStepCompleted < 9) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6">
        <div className="text-7xl">🔒</div>
        <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tight">Certificado Bloqueado</h3>
        <p className="text-gray-500 max-w-sm text-sm">
          Completá los 10 módulos del curso para desbloquear y descargar tu certificado profesional.
        </p>
        <div className="glass p-6 rounded-2xl border-yellow-500/20 max-w-sm w-full">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">Tu progreso</span>
            <span className="text-sm font-black text-white">{user.lastStepCompleted + 1}/10</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
              style={{ width: `${((user.lastStepCompleted + 1) / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const course = COURSES[user.courseChosen];
  const completionDate = new Date().toLocaleDateString('es-AR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const courseLabel = user.courseChosen === CourseType.WEB
    ? 'Arquitectura Web Fullstack Pro'
    : 'Data Analyst Profesional 360';

  const handlePrint = () => {
    const content = certRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Certificado - Tu Futuro IT</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Georgia', serif; 
              background: #030712; 
              display: flex; justify-content: center; align-items: center;
              min-height: 100vh;
            }
          </style>
        </head>
        <body>${content.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Certificate Card */}
      <div
        ref={certRef}
        className="relative max-w-3xl mx-auto rounded-[2.5rem] overflow-hidden border border-yellow-500/30 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20" style={{ background: 'radial-gradient(circle at top left, #eab308, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20" style={{ background: 'radial-gradient(circle at bottom right, #a855f7, transparent)' }} />

        <div className="relative p-10 md:p-16 text-center space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-block border border-yellow-500/40 rounded-full px-6 py-1.5 mb-4">
              <span className="text-yellow-400 font-black text-xs uppercase tracking-[0.3em]">Certificado Oficial</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Tu Futuro IT
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest">Senior Platform · Ecosistema de Formación</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/50" />
            <span className="text-yellow-500 text-xl">★</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/50" />
          </div>

          {/* Main text */}
          <div className="space-y-4">
            <p className="text-gray-400 text-sm uppercase tracking-widest">Este certificado se otorga a</p>
            <h2
              className="text-4xl md:text-5xl font-black text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}
            >
              {user.email.split('@')[0]}
            </h2>
            <p className="text-gray-400 text-sm">Identificado con: <span className="text-gray-300 font-medium">{user.email}</span></p>
          </div>

          {/* Course */}
          <div className="space-y-2">
            <p className="text-gray-400 text-sm uppercase tracking-widest">Por completar exitosamente el curso</p>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{courseLabel}</h3>
            <p className="text-gray-500 text-sm">10 módulos · Formación técnica de nivel Senior</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/50" />
            <span className="text-purple-400 text-xl">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          {/* Footer info */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Fecha</p>
              <p className="text-sm font-bold text-gray-300">{completionDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Módulos</p>
              <p className="text-sm font-bold text-gray-300">10/10 ✓</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Nivel</p>
              <p className="text-sm font-bold text-gray-300">Senior</p>
            </div>
          </div>

          {/* Seal */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-yellow-500/50 flex items-center justify-center"
              style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.15) 0%, transparent 70%)' }}>
              <span className="text-3xl">🏆</span>
            </div>
          </div>

          <p className="text-xs text-gray-700">
            ID de verificación: TFIT-{user.courseChosen.toUpperCase()}-{Date.now().toString(36).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
        <button
          onClick={handlePrint}
          className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95"
        >
          🖨️ Imprimir / Guardar PDF
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(
              `Acabo de completar el curso "${courseLabel}" en Tu Futuro IT 🚀 #TuFuturoIT #IT #DesarrolloWeb`
            );
          }}
          className="flex-1 glass border-white/10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-white/5 active:scale-95"
        >
          📋 Copiar para LinkedIn
        </button>
      </div>
    </div>
  );
};

export default Certificate;

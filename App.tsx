import React, { useState, useEffect, useRef } from 'react';
import { registerUser, loginUser, logoutUser, getMe, saveCourse, saveProgress } from './services/apiService';
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import { User, CourseType } from './types';
import { COURSES } from './constants';
import ProgressBar from './components/ProgressBar';
import InterviewSimulator from './components/InterviewSimulator';
import Certificate from './components/Certificate';
import {
  generateMonetizationStrategy,
  generatePortfolioRoadmap,
} from './services/geminiService';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const INITIAL_USER: User = {
  id: 'guest',
  email: '',
  courseChosen: null,
  lastStepCompleted: -1,
  isLoggedIn: false,
};

// ─── UNIVERSAL VIDEO PLAYER ─────────────────────────────────────────────────
const UniversalVideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedUrl = (originalUrl: string) => {
    if (originalUrl.includes('youtube.com/embed/')) return originalUrl;
    if (originalUrl.includes('watch?v=')) {
      const id = originalUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }
    return originalUrl;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="relative w-full h-full bg-black group overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 animate-pulse">
            Sincronizando streaming...
          </p>
        </div>
      )}
      <iframe
        src={embedUrl}
        title="Video Player"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
      <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">HD Stream</span>
      </div>
    </div>
  );
};

// ─── PORTFOLIO TOOL ─────────────────────────────────────────────────────────
const PortfolioTool: React.FC = () => {
  const [projectIdea, setProjectIdea] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!projectIdea.trim()) return;
    setLoading(true);
    setError('');
    setRoadmap('');
    try {
      const result = await generatePortfolioRoadmap(projectIdea);
      setRoadmap(result);
    } catch (err) {
      setError('Error al conectar con la IA. Verificá tu API Key en .env.local');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-10 bg-gray-900/50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h3 className="text-3xl font-black gradient-text uppercase tracking-tighter">
            Diseñador de Arquitectura de Proyectos
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Estructura técnica de nivel Senior validada por IA. Describí tu idea y obtené un
            blueprint completo.
          </p>
        </div>
        <div className="space-y-4">
          <textarea
            value={projectIdea}
            onChange={e => setProjectIdea(e.target.value)}
            placeholder="Ej: Una app de e-commerce con React, Node y MongoDB que permita a vendedores locales de LATAM vender online..."
            className="w-full bg-black/40 border border-purple-500/20 rounded-3xl p-8 min-h-[160px] focus:ring-2 focus:ring-purple-500 outline-none transition text-gray-200 text-base shadow-inner resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !projectIdea.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-5 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-[0.99] uppercase tracking-widest disabled:opacity-30"
          >
            {loading ? '🧠 Arquitecto Senior Pensando...' : '⚡ Generar Blueprint Técnico'}
          </button>
        </div>
        {error && (
          <div className="glass p-6 rounded-2xl border-red-500/20 bg-red-900/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        {roadmap && (
          <div className="glass p-10 rounded-[2.5rem] border-purple-500/20 animate-fade-in bg-black/40 shadow-2xl">
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-medium">
              {roadmap}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MONETIZATION TOOL ──────────────────────────────────────────────────────
const MonetizationTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'remote' | 'freelance' | 'infoproduct'>('remote');
  const [profile, setProfile] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabs: { id: 'remote' | 'freelance' | 'infoproduct'; label: string; icon: string; activeClass: string }[] = [
    { id: 'remote', label: 'Trabajo Remoto', icon: '🌍', activeClass: 'bg-blue-600 text-white' },
    { id: 'freelance', label: 'Consultoría', icon: '💼', activeClass: 'bg-amber-600 text-white' },
    { id: 'infoproduct', label: 'Infoproductos', icon: '🚀', activeClass: 'bg-purple-600 text-white' },
  ];

  const handleGenerate = async () => {
    if (!profile.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const text = await generateMonetizationStrategy(activeTab, profile);
      setResult(text);
    } catch (err) {
      setError('Error al conectar con la IA. Verificá tu API Key en .env.local');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-900/50">
      <div className="flex flex-wrap gap-3 justify-center border-b border-white/5 pb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(''); setError(''); }}
            className={`px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
              activeTab === tab.id ? tab.activeClass + ' shadow-xl' : 'bg-white/5 text-gray-500 hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="max-w-3xl mx-auto space-y-5">
        <textarea
          value={profile}
          onChange={e => setProfile(e.target.value)}
          placeholder="Ej: Soy dev Jr con 1 año de experiencia en React y Node. Quiero trabajar remotamente para empresas de EEUU ganando en dólares..."
          className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 resize-none transition"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !profile.trim()}
          className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-lg transition shadow-xl disabled:opacity-30 uppercase tracking-widest"
        >
          {loading ? '⚡ Procesando Estrategia...' : '🎯 Obtener Guía IA'}
        </button>
        {error && (
          <div className="glass p-5 rounded-2xl border-red-500/20 bg-red-900/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        {result && (
          <div className="glass p-8 rounded-[2.5rem] border-white/10 animate-fade-in bg-black/30">
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SCROLL TO TOP ───────────────────────────────────────────────────────────
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

// ─── MODAL ───────────────────────────────────────────────────────────────────
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[2.5rem] flex flex-col shadow-2xl border-white/10">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-gray-950 flex-shrink-0">
          <h3 className="text-base font-black uppercase tracking-widest text-blue-400">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-950/40">
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── PROTECTED ROUTE ─────────────────────────────────────────────────────────
const ProtectedRoute: React.FC<{ user: User; children: React.ReactNode }> = ({ user, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.isLoggedIn) navigate('/login');
  }, [user.isLoggedIn, navigate]);
  if (!user.isLoggedIn) return null;
  return <>{children}</>;
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5">
    <Link to="/" className="text-xl font-black gradient-text tracking-tighter">
      TU FUTURO IT
    </Link>
    <div className="flex items-center gap-4 font-bold text-sm uppercase tracking-widest">
      {user.isLoggedIn ? (
        <>
          <span className="text-gray-600 text-xs hidden sm:block">{user.email}</span>
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 transition">
            Dashboard
          </Link>
          <button
            onClick={onLogout}
            className="text-gray-500 hover:text-red-400 transition text-xs"
          >
            Salir
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full font-black text-white transition text-xs"
        >
          Ingresar
        </Link>
      )}
    </div>
  </nav>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="border-t border-gray-900 py-16 px-6 mt-32">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <span className="text-xl font-black gradient-text uppercase tracking-widest">Tu Futuro IT</span>
      <p className="text-gray-600 text-xs">
        © {new Date().getFullYear()} Tu Futuro IT · Ecosistema de Formación Senior. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

// ─── COURSE CARD ──────────────────────────────────────────────────────────────
const CourseCard: React.FC<{ title: string; desc: string; img: string; onClick: () => void }> = ({
  title, desc, img, onClick
}) => (
  <div
    onClick={onClick}
    className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer shadow-2xl transition-all active:scale-[0.98] hover:-translate-y-1"
  >
    <div className="h-[420px]">
      <img
        src={img}
        className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition duration-700"
        alt={title}
        loading="lazy"
      />
    </div>
    <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent">
      <h3 className="text-4xl font-black mb-2 tracking-tighter leading-none">{title}</h3>
      <p className="text-gray-400 text-sm mb-6">{desc}</p>
      <div className="bg-white text-black font-black py-3 px-8 rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition">
        Explorar Ruta →
      </div>
    </div>
  </div>
);

// ─── ACCELERATION CARD ────────────────────────────────────────────────────────
const AccelerationCard: React.FC<{
  title: string; desc: string; icon: string; onClick: () => void;
  activeClass: string; borderClass: string; bgClass: string;
}> = ({ title, desc, icon, onClick, activeClass, borderClass, bgClass }) => (
  <button
    onClick={onClick}
    className={`glass p-8 rounded-[2.5rem] text-left transition-all hover:-translate-y-2 ${borderClass} ${bgClass} group w-full`}
  >
    <div className="text-5xl mb-5">{icon}</div>
    <h3 className={`text-xl font-black mb-3 uppercase ${activeClass}`}>{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </button>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage: React.FC<{
  user: User;
  onSelectCourse: (c: CourseType) => void;
  onOpenModal: (m: 'interview' | 'monetization' | 'portfolio') => void;
}> = ({ user, onSelectCourse, onOpenModal }) => {
  const navigate = useNavigate();

  const handleSelect = (c: CourseType) => {
    if (!user.isLoggedIn) { navigate('/login'); return; }
    onSelectCourse(c);
    navigate(`/curso/${c}`);
  };

  return (
    <div className="container mx-auto px-6 py-20">
      {/* Hero */}
      <div className="text-center mb-24">
        <div className="inline-block glass px-6 py-2 rounded-full mb-8 border-blue-500/20">
          <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">
            🚀 Plataforma de Formación Senior · LATAM
          </span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight uppercase">
          Evoluciona a{' '}
          <span className="gradient-text">Senior</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Formación técnica real, herramientas de monetización y coaching con IA para conseguir
          trabajo remoto en dólares.
        </p>
        {!user.isLoggedIn && (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-black text-lg transition shadow-2xl active:scale-95"
          >
            Comenzar Gratis →
          </button>
        )}
      </div>

      {/* Course Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-3 text-center">Elegí tu Carrera</h2>
        <p className="text-gray-500 text-sm text-center mb-12">
          Dos rutas especializadas. Ambas con certificación y coaching de IA incluido.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-24">
        <CourseCard
          title="Web Architecture"
          desc="Fullstack MERN · React · Node · MongoDB · Deploy"
          img="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
          onClick={() => handleSelect(CourseType.WEB)}
        />
        <CourseCard
          title="Data Science"
          desc="Python · SQL · Power BI · Machine Learning · Estadística"
          img="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
          onClick={() => handleSelect(CourseType.DATA)}
        />
      </div>

      {/* Acceleration Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-3 text-center">Herramientas de Aceleración</h2>
        <p className="text-gray-500 text-sm text-center mb-12">
          IA integrada para ir de estudiante a profesional contratado más rápido.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <AccelerationCard
          title="IA Coach"
          desc="Entrevistas técnicas simuladas con reclutadores de Big Tech. Feedback inmediato en español."
          icon="🤖"
          onClick={() => onOpenModal('interview')}
          activeClass="text-blue-400"
          borderClass="border-blue-500/20"
          bgClass="bg-blue-600/5"
        />
        <AccelerationCard
          title="Monetización"
          desc="Estrategias personalizadas para trabajo remoto, freelance e infoproductos. Gana en USD."
          icon="💰"
          onClick={() => onOpenModal('monetization')}
          activeClass="text-amber-400"
          borderClass="border-amber-500/20"
          bgClass="bg-amber-600/5"
        />
        <AccelerationCard
          title="Portfolio Pro"
          desc="Blueprint técnico de proyectos nivel Senior generado por IA para impresionar reclutadores."
          icon="📁"
          onClick={() => onOpenModal('portfolio')}
          activeClass="text-purple-400"
          borderClass="border-purple-500/20"
          bgClass="bg-purple-600/5"
        />
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage: React.FC<{ onLogin: (userData: any) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Ingresá un email válido.'); return; }
    if (password.length < 4) { setError('La contraseña debe tener al menos 4 caracteres.'); return; }
    setLoading(true);
    try {
      const userData = isRegister
        ? await registerUser(email.trim(), password)
        : await loginUser(email.trim(), password);
      onLogin(userData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-[80vh] flex items-center justify-center px-6">
      <div className="glass p-10 md:p-14 rounded-[2.5rem] w-full max-w-md shadow-2xl border-white/10">
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">🎓</span>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">{isRegister ? 'Crear Cuenta' : 'Campus Virtual'}</h2>
          <p className="text-gray-500 text-sm">{isRegister ? 'Registrate gratis y empezá hoy' : 'Ingresá a tu plataforma de formación'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-200 placeholder-gray-600"
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-200 placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition uppercase tracking-widest mt-2 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Entrar al Campus'}
          </button>
        </form>
        <p className="text-xs text-center mt-6 cursor-pointer text-blue-400 hover:text-blue-300" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
          {isRegister ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate gratis'}
        </p>
        <p className="text-xs text-gray-600 text-center mt-3 leading-relaxed">
          Al ingresar aceptás los términos de uso de Tu Futuro IT.<br />
          <span className="text-gray-700">Tu progreso se guarda en la nube de forma segura.</span>
        </p>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard: React.FC<{
  user: User;
  onSelectCourse: (c: CourseType) => void;
  onOpenModal: (m: 'interview' | 'monetization' | 'portfolio' | 'certificate') => void;
}> = ({ user, onSelectCourse, onOpenModal }) => {
  const navigate = useNavigate();
  const activeCourse = user.courseChosen ? COURSES[user.courseChosen] : null;
  const progress = activeCourse ? ((user.lastStepCompleted + 1) / 10) * 100 : 0;
  const isCompleted = user.lastStepCompleted >= 9;

  return (
    <div className="container mx-auto px-6 py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Bienvenido de vuelta</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            {user.email ? user.email.split('@')[0] : 'Alumno'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="glass border-white/10 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/5 transition"
          >
            Cambiar Curso
          </button>
          {isCompleted && (
            <button
              onClick={() => onOpenModal('certificate')}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition hover:from-yellow-500 hover:to-orange-500"
            >
              🏆 Ver Certificado
            </button>
          )}
        </div>
      </div>

      {activeCourse ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main progress card */}
          <div className="lg:col-span-2 glass p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Curso Activo</p>
                <h2 className="text-2xl font-black uppercase">{activeCourse.title}</h2>
              </div>
              {isCompleted && (
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
                  ✓ Completado
                </span>
              )}
            </div>
            <div className="mb-8">
              <ProgressBar progress={progress} />
            </div>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate(`/curso/${user.courseChosen}`)}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-xl transition active:scale-95 uppercase tracking-wider"
              >
                {isCompleted ? 'Repasar Curso' : 'Continuar Curso →'}
              </button>
              {isCompleted && (
                <button
                  onClick={() => onOpenModal('certificate')}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl transition hover:from-yellow-500 hover:to-orange-500 active:scale-95 uppercase tracking-wider"
                >
                  🏆 Obtener Certificado
                </button>
              )}
            </div>
          </div>

          {/* Stats card */}
          <div className="glass p-8 rounded-[2.5rem] bg-gray-900/50 space-y-6">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Módulos completados</span>
                <span className="font-black text-white">{Math.max(0, user.lastStepCompleted + 1)}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Progreso</span>
                <span className="font-black text-blue-400">{Math.round(progress)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Certificado</span>
                <span className={`font-black ${isCompleted ? 'text-green-400' : 'text-gray-600'}`}>
                  {isCompleted ? '✓ Disponible' : 'Bloqueado'}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gray-600 leading-relaxed">
                {isCompleted
                  ? '¡Felicitaciones! Ya podés descargar tu certificado profesional.'
                  : `Completá ${10 - (user.lastStepCompleted + 1)} módulos más para obtener tu certificado.`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-2 border-white/10">
          <div className="text-6xl mb-6">🎯</div>
          <h3 className="text-2xl font-black mb-4 uppercase">Elegí tu Carrera</h3>
          <p className="text-gray-500 mb-10 text-sm">Todavía no tenés un curso activo. Empezá hoy.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:from-blue-500 hover:to-purple-500 transition"
          >
            Ver Cursos →
          </button>
        </div>
      )}

      {/* Tools */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-widest mb-6 text-gray-500">
          Herramientas de Aceleración
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { label: 'IA Career Coach', desc: 'Entrevistas técnicas', icon: '🤖', modal: 'interview' as const, color: 'blue' },
            { label: 'Monetización', desc: 'Ganá en USD', icon: '💰', modal: 'monetization' as const, color: 'amber' },
            { label: 'Portfolio Pro', desc: 'Blueprint técnico', icon: '📁', modal: 'portfolio' as const, color: 'purple' },
          ].map(tool => (
            <button
              key={tool.label}
              onClick={() => onOpenModal(tool.modal)}
              className="glass p-6 rounded-3xl text-left hover:-translate-y-1 transition-all border-white/5 hover:border-white/10 group"
            >
              <span className="text-4xl block mb-4">{tool.icon}</span>
              <p className="font-black text-sm uppercase">{tool.label}</p>
              <p className="text-gray-500 text-xs mt-1">{tool.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── COURSE VIEW ──────────────────────────────────────────────────────────────
const CourseView: React.FC<{ user: User; onComplete: (id: number) => void }> = ({
  user,
  onComplete,
}) => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const course = type && (type === CourseType.WEB || type === CourseType.DATA) ? COURSES[type as CourseType] : null;

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);

  useEffect(() => {
    if (!course) { navigate('/'); return; }
    if (!user.isLoggedIn) { navigate('/login'); return; }
    const startIndex = Math.min(Math.max(user.lastStepCompleted + 1, 0), 9);
    setActiveModuleIndex(startIndex);
  }, [course, user.isLoggedIn, navigate]);

  if (!course) return null;
  const currentModule = course.modules[activeModuleIndex];
  const isModuleLocked = (idx: number) => idx > user.lastStepCompleted + 1;

  const handleValidation = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentModule.challenge.correctAnswer;
    setFeedbackCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      onComplete(activeModuleIndex);
      if (activeModuleIndex < 9) {
        setTimeout(() => {
          setActiveModuleIndex(prev => prev + 1);
          setSelectedOption(null);
          setShowFeedback(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
      }
    }
  };

  const resetAnswer = () => {
    setSelectedOption(null);
    setShowFeedback(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="lg:w-72 glass border-r border-white/5 p-5 overflow-y-auto lg:max-h-screen lg:sticky lg:top-20">
        <p className="text-[10px] font-black uppercase text-blue-500 mb-4 tracking-widest">
          {course.title}
        </p>
        <div className="space-y-2">
          {course.modules.map((m, idx) => {
            const isCompleted = idx <= user.lastStepCompleted;
            const isActive = idx === activeModuleIndex;
            const isLocked = isModuleLocked(idx);
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (!isLocked) {
                    setActiveModuleIndex(idx);
                    setSelectedOption(null);
                    setShowFeedback(false);
                  }
                }}
                disabled={isLocked}
                className={`w-full text-left p-3.5 rounded-2xl transition border text-xs ${
                  isActive
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : isCompleted
                    ? 'bg-green-900/30 border-green-700/30 text-green-300 hover:bg-green-900/50'
                    : isLocked
                    ? 'bg-white/2 border-transparent opacity-30 cursor-not-allowed text-gray-600'
                    : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black opacity-60 shrink-0">
                    {isCompleted ? '✓' : `${idx + 1}`}
                  </span>
                  <span className="font-bold truncate">{m.title}</span>
                  {isLocked && <span className="ml-auto text-[10px]">🔒</span>}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-5 md:p-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
            Módulo {activeModuleIndex + 1} de 10
          </span>
          {activeModuleIndex <= user.lastStepCompleted && (
            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              Completado
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-8 leading-tight tracking-tight">
          {currentModule.title}
        </h1>

        {/* Video */}
        <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl video-shadow mb-10 ring-1 ring-white/10">
          <UniversalVideoPlayer url={currentModule.videoUrl} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-8 rounded-[2rem] border-white/5">
              <h3 className="text-base font-black mb-4 uppercase text-blue-400">Guía del Experto</h3>
              <p className="text-gray-300 text-base leading-relaxed">{currentModule.detailedContent}</p>
            </div>
            <div className="glass p-8 rounded-[2rem] border-yellow-500/10 bg-yellow-900/5">
              <h3 className="text-base font-black mb-4 uppercase text-yellow-400">💡 Senior Tip</h3>
              <p className="text-gray-300 text-sm leading-relaxed italic">{currentModule.seniorTip}</p>
            </div>
            <div className="glass p-8 rounded-[2rem] border-white/5">
              <h3 className="text-base font-black mb-5 uppercase text-gray-400">Lo que vas a aprender</h3>
              <div className="grid grid-cols-2 gap-3">
                {currentModule.learningPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm">→</span>
                    <span className="text-gray-300 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quiz */}
          <div className="lg:col-span-1">
            <div className="glass p-7 rounded-[2rem] border-blue-500/20 sticky top-24">
              <h4 className="text-sm font-black mb-5 uppercase text-blue-400">Test de Validación</h4>
              <p className="font-bold text-sm mb-5 leading-relaxed text-gray-200">
                {currentModule.challenge.question}
              </p>
              <div className="space-y-2.5 mb-5">
                {currentModule.challenge.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !showFeedback && setSelectedOption(i)}
                    disabled={showFeedback}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition ${
                      showFeedback
                        ? i === currentModule.challenge.correctAnswer
                          ? 'bg-green-900/40 border-green-500 text-green-300'
                          : selectedOption === i
                          ? 'bg-red-900/40 border-red-500 text-red-300'
                          : 'bg-black/20 border-white/5 opacity-50'
                        : selectedOption === i
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {showFeedback && (
                <div
                  className={`text-xs rounded-xl p-3.5 mb-4 leading-relaxed border ${
                    feedbackCorrect
                      ? 'bg-green-900/20 border-green-500/30 text-green-300'
                      : 'bg-red-900/20 border-red-500/30 text-red-300'
                  }`}
                >
                  {feedbackCorrect
                    ? `✓ ¡Correcto! ${currentModule.challenge.explanation}`
                    : `✗ Incorrecto. ${currentModule.challenge.explanation}`}
                </div>
              )}

              {!showFeedback ? (
                <button
                  onClick={handleValidation}
                  disabled={selectedOption === null}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-2xl font-black text-sm shadow-xl transition disabled:opacity-20 uppercase tracking-widest"
                >
                  Validar Módulo
                </button>
              ) : !feedbackCorrect ? (
                <button
                  onClick={resetAnswer}
                  className="w-full bg-orange-700 hover:bg-orange-600 py-3.5 rounded-2xl font-black text-sm shadow-xl transition uppercase tracking-widest"
                >
                  Intentar de nuevo
                </button>
              ) : activeModuleIndex < 9 ? (
                <div className="text-center text-green-400 text-sm font-black animate-pulse">
                  ✓ Avanzando al siguiente módulo...
                </div>
              ) : (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 py-3.5 rounded-2xl font-black text-sm shadow-xl transition uppercase tracking-widest"
                >
                  🏆 Ver Certificado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── NOT FOUND ─────────────────────────────────────────────────────────────
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto h-[70vh] flex flex-col items-center justify-center text-center gap-6">
      <span className="text-8xl">🔍</span>
      <h1 className="text-4xl font-black uppercase tracking-tight">Página no encontrada</h1>
      <p className="text-gray-500">La ruta que buscás no existe en este campus.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [activeModal, setActiveModal] = useState<
    'interview' | 'monetization' | 'portfolio' | 'certificate' | null
  >(null);

  // Al cargar, verificar si hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem('tfit_token');
    if (token) {
      getMe()
        .then(userData => {
          setUser({
            id: String(userData.id),
            email: userData.email,
            courseChosen: userData.courseChosen as CourseType | null,
            lastStepCompleted: userData.lastStepCompleted,
            isLoggedIn: true,
          });
        })
        .catch(() => {
          localStorage.removeItem('tfit_token');
        });
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser({
      id: String(userData.id),
      email: userData.email,
      courseChosen: userData.courseChosen as CourseType | null,
      lastStepCompleted: userData.lastStepCompleted ?? -1,
      isLoggedIn: true,
    });
  };

  const handleLogout = () => {
    logoutUser();
    setUser(INITIAL_USER);
  };

  const selectCourse = (course: CourseType) => {
    setUser(prev => ({ ...prev, courseChosen: course, lastStepCompleted: -1 }));
    saveCourse(course).catch(console.error);
  };

  const completeModule = (moduleId: number) => {
    setUser(prev => {
      if (moduleId > prev.lastStepCompleted) {
        saveProgress(moduleId).catch(console.error);
        return { ...prev, lastStepCompleted: moduleId };
      }
      return prev;
    });
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  user={user}
                  onSelectCourse={selectCourse}
                  onOpenModal={setActiveModal}
                />
              }
            />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route
              path="/curso/:type"
              element={
                <ProtectedRoute user={user}>
                  <CourseView user={user} onComplete={completeModule} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard
                    user={user}
                    onSelectCourse={selectCourse}
                    onOpenModal={setActiveModal}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />

        {/* Modals */}
        <Modal
          isOpen={activeModal === 'interview'}
          onClose={() => setActiveModal(null)}
          title="IA Career Coach · Simulador de Entrevistas"
        >
          <InterviewSimulator
            role={
              user.courseChosen === CourseType.WEB
                ? 'Senior Fullstack Engineer (MERN)'
                : 'Senior Data Analyst / Data Scientist'
            }
          />
        </Modal>

        <Modal
          isOpen={activeModal === 'monetization'}
          onClose={() => setActiveModal(null)}
          title="Hub de Monetización · Estrategias USD"
        >
          <MonetizationTool />
        </Modal>

        <Modal
          isOpen={activeModal === 'portfolio'}
          onClose={() => setActiveModal(null)}
          title="Portfolio Enterprise · Blueprint Técnico"
        >
          <PortfolioTool />
        </Modal>

        <Modal
          isOpen={activeModal === 'certificate'}
          onClose={() => setActiveModal(null)}
          title="Certificado Profesional · Tu Futuro IT"
        >
          <Certificate user={user} />
        </Modal>
      </div>
    </Router>
  );
};

export default App;

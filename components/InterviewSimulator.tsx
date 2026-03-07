import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { sendInterviewMessage } from '../services/geminiService';

interface InterviewSimulatorProps {
  role: string;
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ role }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toGeminiHistory = (msgs: ChatMessage[]): GeminiMessage[] =>
    msgs.map(m => ({ role: m.role, parts: [{ text: m.text }] }));

  const startInterview = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const greeting = await sendInterviewMessage(role, [], 'Hola, estoy listo para comenzar la entrevista.');
      setMessages([
        { role: 'model', text: greeting }
      ]);
    } catch {
      setMessages([{ role: 'model', text: 'Error al conectar con la IA. Verificá tu API Key.' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = toGeminiHistory(messages);
      const response = await sendInterviewMessage(role, history, userText);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: '⚠️ Error de conexión. Intentá de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setMessages([]);
    setStarted(false);
    setInput('');
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8">
        <div className="text-7xl">🤖</div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black gradient-text uppercase tracking-tight">IA Career Coach</h3>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed">
            Simulá una entrevista técnica real para el puesto de <span className="text-blue-400 font-bold">{role}</span>. La IA actuará como reclutador de una empresa top-tier.
          </p>
        </div>
        <div className="glass p-6 rounded-2xl max-w-sm w-full space-y-3 text-left border-blue-500/20">
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Qué esperar</p>
          {['Preguntas técnicas reales de entrevistas Big Tech', 'Feedback inmediato sobre tus respuestas', 'Preguntas de arquitectura y situacionales', 'Evaluación final de tu performance'].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <button
          onClick={startInterview}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl uppercase tracking-widest active:scale-95"
        >
          Comenzar Entrevista
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-gray-950/60">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Entrevista en curso · {role}</span>
        </div>
        <button
          onClick={resetInterview}
          className="text-xs text-gray-600 hover:text-red-400 transition font-bold uppercase tracking-wider"
        >
          Reiniciar
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'glass border-white/10 text-gray-200 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm ml-3 flex-shrink-0 mt-1">
                👤
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm mr-3 flex-shrink-0">
              🤖
            </div>
            <div className="glass border-white/10 rounded-2xl rounded-tl-sm px-5 py-4">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-gray-950/60">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Escribí tu respuesta..."
            disabled={loading}
            className="flex-1 bg-gray-900/80 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-gray-200 placeholder-gray-600"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 px-6 rounded-2xl font-black text-sm transition active:scale-95 uppercase tracking-wider whitespace-nowrap"
          >
            Enviar
          </button>
        </div>
        <p className="text-xs text-gray-700 mt-2 text-center">Presioná Enter para enviar · La IA puede tardar unos segundos</p>
      </div>
    </div>
  );
};

export default InterviewSimulator;

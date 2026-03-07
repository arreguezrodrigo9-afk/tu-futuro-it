// services/geminiService.ts
// Servicio centralizado para todas las llamadas a la API de Google Gemini

const API_KEY = (typeof process !== 'undefined' && process.env?.API_KEY) || '';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

async function callGemini(
  model: string,
  systemInstruction: string,
  messages: GeminiMessage[],
  temperature = 0.8
): Promise<string> {
  if (!API_KEY) {
    return '⚠️ API Key no configurada. Añadí GEMINI_API_KEY en tu archivo .env.local para activar la IA.';
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const body = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: messages,
    generationConfig: {
      temperature,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Gemini API error:', err);
    throw new Error(`Error de API: ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta de la IA.';
}

// ---- PORTFOLIO ROADMAP (Gemini Flash) ----
export async function generatePortfolioRoadmap(projectIdea: string): Promise<string> {
  const system = `Eres un arquitecto de software Senior con 15 años de experiencia en empresas como Google y MercadoLibre. 
Tu tarea es crear un blueprint técnico DETALLADO y ACCIONABLE para proyectos de portfolio. 
Responde SIEMPRE en español. Estructura tu respuesta así:
1. 🎯 OBJETIVO DEL PROYECTO
2. 🏗️ ARQUITECTURA TÉCNICA (stack recomendado con justificación)
3. 📁 ESTRUCTURA DE CARPETAS
4. 🔗 ENDPOINTS / COMPONENTES CLAVE
5. 🗄️ MODELO DE DATOS
6. 🚀 FASES DE DESARROLLO (con estimación de tiempo)
7. 💡 DIFERENCIADORES SENIOR (qué hace especial este proyecto)
8. 📌 RECURSOS CLAVE (librerías, docs oficiales)`;

  const messages: GeminiMessage[] = [
    { role: 'user', parts: [{ text: `Crea un blueprint técnico para este proyecto: ${projectIdea}` }] }
  ];

  return callGemini('gemini-2.0-flash', system, messages, 0.7);
}

// ---- MONETIZATION STRATEGY (Gemini Flash) ----
export async function generateMonetizationStrategy(
  type: 'remote' | 'freelance' | 'infoproduct',
  profile: string
): Promise<string> {
  const typeMap = {
    remote: 'trabajo remoto en empresas internacionales (USD)',
    freelance: 'consultoría freelance y agencia de servicios IT',
    infoproduct: 'infoproductos digitales (cursos, ebooks, mentorías)',
  };

  const system = `Eres un coach de carrera IT especializado en el mercado latinoamericano y trabajo remoto. 
Conocés perfectamente plataformas como Toptal, Upwork, LinkedIn, Gumroad y comunidades de devs en LATAM. 
Responde SIEMPRE en español, con tono motivador pero realista. Sé específico con números y plazos reales.`;

  const messages: GeminiMessage[] = [
    {
      role: 'user',
      parts: [{
        text: `Crea una estrategia detallada y accionable de ${typeMap[type]} para este perfil:
        
${profile}

Incluye: pasos concretos, plataformas recomendadas, rango de tarifas en USD, timeline realista y errores comunes a evitar.`
      }]
    }
  ];

  return callGemini('gemini-2.0-flash', system, messages, 0.8);
}

// ---- INTERVIEW SIMULATOR (Gemini Flash, multi-turn) ----
export async function sendInterviewMessage(
  role: string,
  history: GeminiMessage[],
  userMessage: string
): Promise<string> {
  const system = `Eres un reclutador técnico Senior de una empresa de tecnología de primer nivel (como Mercado Libre, Nubank o una startup de Silicon Valley con equipo remoto). 
Estás entrevistando a un candidato para el puesto de ${role}.

INSTRUCCIONES:
- Haz preguntas técnicas desafiantes pero justas, una a la vez
- Evalúa las respuestas con criterio profesional
- Si la respuesta es incorrecta o incompleta, da feedback constructivo y explica la respuesta correcta
- Alterna entre preguntas técnicas, de situación (STAR) y de arquitectura
- Mantén el rol de entrevistador en todo momento
- Responde SIEMPRE en español
- Sé directo pero respetuoso
- Después de 5-6 preguntas, ofrece un feedback final del candidato`;

  const messages: GeminiMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  return callGemini('gemini-2.0-flash', system, messages, 0.9);
}

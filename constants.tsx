import { CourseType, CourseData } from './types';

export const COURSES: Record<CourseType, CourseData> = {
  [CourseType.WEB]: {
    id: CourseType.WEB,
    title: 'Arquitectura Web Fullstack Pro',
    description: 'Domina el stack MERN y despliegue profesional. De cero a desplegar aplicaciones escalables.',
    modules: [
      {
        id: 0,
        title: 'Fundamentos Modernos: HTML5 y Semántica',
        description: 'No solo etiquetas, sino accesibilidad y SEO técnico.',
        videoUrl: 'https://www.youtube.com/embed/rbuYtrNUxg4',
        learningPoints: ['DOM Tree', 'SEO On-page', 'Accesibilidad (ARIA)', 'Etiquetas semánticas'],
        detailedContent: 'La web moderna se construye sobre semántica. Aprenderás por qué un <div> no debe usarse para todo y cómo los motores de búsqueda indexan tu contenido. Cada etiqueta tiene un significado que los navegadores y lectores de pantalla interpretan.',
        seniorTip: 'En una entrevista, hablar de accesibilidad te diferencia del 90% de los juniors.',
        challenge: {
          question: '¿Qué etiqueta es semánticamente correcta para la navegación principal?',
          options: ['<div id="nav">', '<section>', '<nav>', '<header>'],
          correctAnswer: 2,
          explanation: 'La etiqueta <nav> define un bloque de enlaces de navegación principal.'
        }
      },
      {
        id: 1,
        title: 'CSS3: Layouts con Grid y Flexbox',
        description: 'Dominando el diseño responsivo sin frameworks pesados.',
        videoUrl: 'https://www.youtube.com/embed/wZniZE7T7S0',
        learningPoints: ['Flexbox container vs items', 'Grid áreas', 'Mobile First Design', 'CSS Variables'],
        detailedContent: 'Entenderás el flujo de caja y cómo crear interfaces que se adaptan a cualquier dispositivo sin romper el diseño. Flexbox para una dimensión, Grid para dos. La combinación correcta elimina el 90% de los hacks de CSS.',
        seniorTip: 'Evita librerías de UI hasta que domines CSS puro. Los Seniors saben debuguear el CSS de un componente roto.',
        challenge: {
          question: 'En Flexbox, ¿qué propiedad alinea los items en el eje principal?',
          options: ['align-items', 'justify-content', 'display-flex', 'flex-direction'],
          correctAnswer: 1,
          explanation: 'justify-content se encarga de la distribución en el eje principal (horizontal por defecto).'
        }
      },
      {
        id: 2,
        title: 'JavaScript: El Corazón del Desarrollo',
        description: 'Lógica pura, tipos de datos y manipulación del DOM.',
        videoUrl: 'https://www.youtube.com/embed/ivdTnPl1wa0',
        learningPoints: ['Variables (let/const)', 'Arrow Functions', 'Closures', 'Event Loop'],
        detailedContent: 'JavaScript no es solo sintaxis, es entender el motor V8 y cómo se ejecutan las tareas asíncronas. El Event Loop es la clave para entender por qué el código no siempre se ejecuta en el orden que escribís.',
        seniorTip: 'Aprende a usar console.table() y el debugger del navegador. Te ahorrará horas de frustración.',
        challenge: {
          question: '¿Cuál es la salida de typeof [] en JavaScript?',
          options: ['array', 'list', 'object', 'undefined'],
          correctAnswer: 2,
          explanation: 'En JS, los arrays son técnicamente objetos especializados. Usá Array.isArray() para verificar arrays.'
        }
      },
      {
        id: 3,
        title: 'ES6+ y JavaScript Moderno',
        description: 'Promesas, Async/Await y Desestructuración.',
        videoUrl: 'https://www.youtube.com/embed/Y86683_Kx30',
        learningPoints: ['Spread Operator', 'Map/Filter/Reduce', 'Modularización', 'Fetch API'],
        detailedContent: 'El código moderno es declarativo. Aprenderás a transformar datos usando métodos funcionales eficientes y a manejar operaciones asíncronas de forma limpia con async/await.',
        seniorTip: 'Usa .map() y .filter() en lugar de ciclos for siempre que puedas. Es más legible y mantenible.',
        challenge: {
          question: '¿Qué método crea un nuevo array con los elementos que pasan una condición?',
          options: ['find()', 'map()', 'filter()', 'reduce()'],
          correctAnswer: 2,
          explanation: 'filter() crea un subconjunto basado en un predicado booleano sin mutar el array original.'
        }
      },
      {
        id: 4,
        title: 'React.js: La Revolución de Componentes',
        description: 'Estado, Props y el Ciclo de Vida moderno con Hooks.',
        videoUrl: 'https://www.youtube.com/embed/7iobxzd_nuA',
        learningPoints: ['Virtual DOM', 'JSX Syntax', 'useState', 'useEffect'],
        detailedContent: 'React no es una librería de vistas, es un sistema para gestionar la complejidad de la UI mediante la composición. El Virtual DOM optimiza las actualizaciones del DOM real para máximo rendimiento.',
        seniorTip: 'No abuses del estado global. Mantén el estado lo más cerca posible de donde se consume.',
        challenge: {
          question: '¿Qué Hook se utiliza para manejar efectos secundarios en React?',
          options: ['useState', 'useRef', 'useMemo', 'useEffect'],
          correctAnswer: 3,
          explanation: 'useEffect permite ejecutar código en respuesta a cambios en dependencias (fetching, subscripciones, etc).'
        }
      },
      {
        id: 5,
        title: 'Node.js y Express: Servidores de Alto Rendimiento',
        description: 'Construyendo APIs RESTful escalables.',
        videoUrl: 'https://www.youtube.com/embed/1hpc70_Jdg0',
        learningPoints: ['NPM/Yarn', 'Middleware', 'Routing', 'Request/Response cycle'],
        detailedContent: 'Lleva tu JavaScript al servidor. Aprenderás a gestionar peticiones, cabeceras y lógica de negocio. Express es minimalista a propósito: vos elegís solo lo que necesitás.',
        seniorTip: 'Siempre valida los datos de entrada (body/params). Nunca confíes en lo que envía el cliente.',
        challenge: {
          question: '¿Qué método de Express se usa para definir una ruta GET?',
          options: ['app.post()', 'app.listen()', 'app.get()', 'app.use()'],
          correctAnswer: 2,
          explanation: 'app.get() mapea peticiones HTTP GET a una función manejadora específica.'
        }
      },
      {
        id: 6,
        title: 'Bases de Datos con MongoDB',
        description: 'Modelado NoSQL para aplicaciones ágiles.',
        videoUrl: 'https://www.youtube.com/embed/v_Y9rM5-7_k',
        learningPoints: ['Colecciones y Documentos', 'Mongoose ODM', 'Agregaciones', 'CRUD'],
        detailedContent: 'Aprenderás a almacenar información de forma flexible y cómo conectar tu servidor Node con la base de datos. MongoDB almacena documentos JSON lo que elimina el impedance mismatch con JavaScript.',
        seniorTip: 'Aunque MongoDB es flexible, un buen esquema en Mongoose evita inconsistencias de datos a largo plazo.',
        challenge: {
          question: '¿Cuál es el formato en el que MongoDB almacena los documentos?',
          options: ['JSON', 'BSON', 'SQL', 'XML'],
          correctAnswer: 1,
          explanation: 'MongoDB usa BSON (Binary JSON) para almacenamiento eficiente y soporte de tipos adicionales.'
        }
      },
      {
        id: 7,
        title: 'Autenticación y Seguridad (JWT)',
        description: 'Protegiendo rutas y datos de usuario.',
        videoUrl: 'https://www.youtube.com/embed/6iZ6rG6n6kM',
        learningPoints: ['Hasheo de contraseñas', 'Bcrypt', 'Cookies vs LocalStorage', 'CORS'],
        detailedContent: 'La seguridad no es negociable. Aprenderás a implementar Login y Registro usando estándares de la industria con JWT para autenticación stateless y bcrypt para hash de contraseñas.',
        seniorTip: 'Nunca guardes contraseñas en texto plano. Usa Bcrypt con un salt de al menos 12 rounds.',
        challenge: {
          question: '¿Qué significa JWT?',
          options: ['Java Web Token', 'JSON Web Token', 'Just Web Tools', 'Joint Web Task'],
          correctAnswer: 1,
          explanation: 'JSON Web Token es el estándar RFC 7519 para transmitir información segura entre partes como un objeto JSON.'
        }
      },
      {
        id: 8,
        title: 'Arquitectura y Patrones (Clean Code)',
        description: 'Escribiendo código profesional.',
        videoUrl: 'https://www.youtube.com/embed/Uu4p_S-m90o',
        learningPoints: ['SOLID', 'DRY', 'KISS', 'Estructura de carpetas'],
        detailedContent: 'Ser programador senior es escribir código para humanos. Aprenderás a refactorizar, organizar proyectos grandes y comunicar intenciones claramente a través del código.',
        seniorTip: 'Si tu función tiene más de 20 líneas, probablemente esté haciendo demasiadas cosas.',
        challenge: {
          question: '¿Qué significa el principio DRY?',
          options: ['Do Real Yield', 'Dont Repeat Yourself', 'Data Resource Yearly', 'Design Rules Yes'],
          correctAnswer: 1,
          explanation: 'Dont Repeat Yourself: evita la duplicación de lógica para facilitar el mantenimiento del código.'
        }
      },
      {
        id: 9,
        title: 'Despliegue y Portfolio Final',
        description: 'Lanzando tu carrera al mundo.',
        videoUrl: 'https://www.youtube.com/embed/wR_f6l9l-Y8',
        learningPoints: ['Vercel/Railway', 'GitHub Actions', 'LinkedIn para Devs', 'Soft Skills'],
        detailedContent: 'Aprenderás a desplegar tu app fullstack en producción y cómo presentar tus proyectos para conseguir tu primer empleo IT. El portfolio es tu nueva hoja de vida.',
        seniorTip: 'Un proyecto terminado y desplegado vale más que diez cursos a medio empezar.',
        challenge: {
          question: '¿Qué herramienta es líder para despliegue de Frontend React?',
          options: ['Vercel', 'XAMPP', 'WordPress', 'FileZilla'],
          correctAnswer: 0,
          explanation: 'Vercel ofrece integración nativa con GitHub y optimización automática para proyectos React/Next.js.'
        }
      }
    ]
  },
  [CourseType.DATA]: {
    id: CourseType.DATA,
    title: 'Data Analyst Profesional 360',
    description: 'De los datos a las decisiones. Domina SQL, Python, estadística y visualización de alto impacto.',
    modules: [
      {
        id: 0,
        title: 'Fundamentos del Análisis de Datos',
        description: 'El mindset del analista.',
        videoUrl: 'https://www.youtube.com/embed/X3paOmcrTjQ',
        learningPoints: ['ETL Process', 'Tipos de datos', 'Calidad de datos', 'Business Intelligence'],
        detailedContent: 'Aprenderás a hacerte las preguntas correctas antes de tocar cualquier herramienta. El análisis de datos empieza por entender el problema de negocio, no por abrir Python.',
        seniorTip: 'El mejor analista no es el que sabe más Python, sino el que entiende mejor el negocio.',
        challenge: {
          question: '¿Qué significa ETL en el mundo de los datos?',
          options: ['Enter Time Late', 'Extract, Transform, Load', 'Easy Tool Logic', 'Every Task List'],
          correctAnswer: 1,
          explanation: 'ETL es el proceso de Extraer datos de fuentes, Transformarlos y Cargarlos en un destino.'
        }
      },
      {
        id: 1,
        title: 'Excel Avanzado para Analistas',
        description: 'Tablas dinámicas y Power Query.',
        videoUrl: 'https://www.youtube.com/embed/r9S99_J_fI8',
        learningPoints: ['VLOOKUP/XLOOKUP', 'Pivot Tables', 'Data Cleaning', 'Power Query'],
        detailedContent: 'Excel sigue siendo el rey en empresas. Aprenderás a limpiar miles de filas de forma automática y profesional usando Power Query y tablas dinámicas avanzadas.',
        seniorTip: 'Si haces algo repetitivo en Excel más de 3 veces, automatízalo con Power Query o macros.',
        challenge: {
          question: '¿Qué herramienta de Excel permite automatizar la limpieza de datos?',
          options: ['Paint', 'Power Query', 'WordPad', 'Task Manager'],
          correctAnswer: 1,
          explanation: 'Power Query es el motor de transformación de datos integrado en Excel y Power BI.'
        }
      },
      {
        id: 2,
        title: 'SQL: El Lenguaje de las Bases de Datos',
        description: 'Extracción de información masiva.',
        videoUrl: 'https://www.youtube.com/embed/HXV3zeQHqGY',
        learningPoints: ['SELECT/FROM', 'JOINs', 'GROUP BY', 'Subqueries'],
        detailedContent: 'SQL es la habilidad más demandada en análisis de datos. Aprenderás a cruzar tablas y extraer insights de bases de datos relacionales de millones de registros.',
        seniorTip: 'Domina los JOINs. En el mundo real, los datos siempre están repartidos en múltiples tablas.',
        challenge: {
          question: '¿Qué comando se usa para combinar filas de dos o más tablas?',
          options: ['COMBINE', 'MERGE', 'JOIN', 'LINK'],
          correctAnswer: 2,
          explanation: 'JOIN permite relacionar tablas basadas en una columna común (clave foránea).'
        }
      },
      {
        id: 3,
        title: 'Python para Ciencia de Datos',
        description: 'Automatización y manipulación de datos.',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
        learningPoints: ['Listas/Diccionarios', 'Funciones', 'Pandas Library', 'Numpy'],
        detailedContent: 'Python es la navaja suiza del analista. Aprenderás a leer archivos CSV, Excel y JSON para procesarlos a gran velocidad con Pandas y transformar datos complejos en segundos.',
        seniorTip: 'Aprende Pandas a fondo. Es el estándar de la industria para manipulación de tablas de datos.',
        challenge: {
          question: '¿Cuál es la librería principal de Python para manipulación de DataFrames?',
          options: ['Pygame', 'Pandas', 'Flask', 'Django'],
          correctAnswer: 1,
          explanation: 'Pandas es la biblioteca fundamental para el análisis de datos estructurados en Python.'
        }
      },
      {
        id: 4,
        title: 'Estadística Descriptiva e Inferencial',
        description: 'La base matemática.',
        videoUrl: 'https://www.youtube.com/embed/Xn7K_ak939w',
        learningPoints: ['Media/Mediana/Moda', 'Desviación estándar', 'Distribución Normal', 'P-values'],
        detailedContent: 'Los datos sin estadística son solo números. Aprenderás a detectar anomalías, validar hipótesis y tomar decisiones basadas en evidencia estadística real.',
        seniorTip: 'Cuidado con el promedio. Un outlier puede distorsionar toda tu conclusión. Siempre revisá la distribución.',
        challenge: {
          question: '¿Qué medida indica cuánto se alejan los datos del promedio?',
          options: ['Moda', 'Rango', 'Desviación Estándar', 'Mediana'],
          correctAnswer: 2,
          explanation: 'La desviación estándar mide la dispersión promedio de los datos respecto a la media.'
        }
      },
      {
        id: 5,
        title: 'Visualización con Power BI',
        description: 'Creando Dashboards de impacto.',
        videoUrl: 'https://www.youtube.com/embed/9N8m6m-V7fU',
        learningPoints: ['Data Storytelling', 'KPIs', 'Filtros dinámicos', 'Jerarquías'],
        detailedContent: 'Una imagen vale más que mil filas de datos. Aprenderás a comunicar hallazgos de forma visual e impactante usando Power BI para crear dashboards ejecutivos.',
        seniorTip: 'Menos es más. No llenes un dashboard de gráficos. Enfócate en las 3 métricas que importan al negocio.',
        challenge: {
          question: '¿Qué es un KPI?',
          options: ['Key Performance Indicator', 'Knowledge Plot Info', 'Kilos Per Inch', 'Keep Point Idea'],
          correctAnswer: 0,
          explanation: 'Un KPI (Key Performance Indicator) es una métrica clave para medir el éxito de un objetivo.'
        }
      },
      {
        id: 6,
        title: 'Limpieza de Datos (Data Wrangling)',
        description: 'El 80% del trabajo del analista.',
        videoUrl: 'https://www.youtube.com/embed/GPVsHOlRBBI',
        learningPoints: ['Missing Values', 'Outliers', 'Normalization', 'Deduplicación'],
        detailedContent: 'Aprenderás a lidiar con datos sucios, incompletos y ruidosos. Esta es la habilidad más practicada en el mundo real: el 80% del tiempo de un analista se va en limpiar datos.',
        seniorTip: 'Basura entra, basura sale (GIGO). Si tus datos están sucios, tus gráficos serán mentira.',
        challenge: {
          question: '¿Qué se debe hacer con los valores duplicados en un dataset?',
          options: ['Ignorarlos', 'Multiplicarlos', 'Eliminarlos o tratarlos', 'Colorearlos'],
          correctAnswer: 2,
          explanation: 'Los duplicados sesgan los resultados estadísticos y deben eliminarse durante la limpieza.'
        }
      },
      {
        id: 7,
        title: 'Introducción al Machine Learning',
        description: 'Prediciendo el futuro.',
        videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg',
        learningPoints: ['Regresión Lineal', 'Clasificación', 'Scikit-Learn', 'Overfitting'],
        detailedContent: 'Aprenderás a entrenar algoritmos para predecir ventas o categorizar clientes automáticamente. Scikit-learn hace que implementar ML sea accesible sin matemáticas avanzadas.',
        seniorTip: 'No uses redes neuronales para todo. A veces una regresión lineal es más efectiva y explicable.',
        challenge: {
          question: '¿Cómo se llama cuando un modelo aprende demasiado los datos de entrenamiento y falla en los nuevos?',
          options: ['Perfecting', 'Overfitting', 'Underloading', 'Superlearning'],
          correctAnswer: 1,
          explanation: 'El overfitting ocurre cuando el modelo memoriza el ruido de los datos y no generaliza bien.'
        }
      },
      {
        id: 8,
        title: 'Storytelling y Comunicación de Datos',
        description: 'Cómo vender tus hallazgos.',
        videoUrl: 'https://www.youtube.com/embed/zO-S9qV0M4s',
        learningPoints: ['Presentaciones ejecutivas', 'Puntos de dolor', 'Recomendaciones', 'Soft Skills'],
        detailedContent: 'Aprenderás a hablar el idioma de los negocios para que tus análisis se conviertan en acciones reales. El mejor análisis sin comunicación efectiva no vale nada.',
        seniorTip: 'Nunca presentes un gráfico sin explicar qué acción debería tomar la empresa basándose en él.',
        challenge: {
          question: '¿Cuál es el objetivo final de un análisis de datos?',
          options: ['Hacer gráficos bonitos', 'Usar Python', 'Tomar decisiones informadas', 'Llenar el servidor'],
          correctAnswer: 2,
          explanation: 'El análisis existe para reducir la incertidumbre y fundamentar la toma de decisiones empresariales.'
        }
      },
      {
        id: 9,
        title: 'Proyecto Final de Insights Reales',
        description: 'Tu primer caso de estudio profesional.',
        videoUrl: 'https://www.youtube.com/embed/S_f7S9_t6I8',
        learningPoints: ['End-to-end analysis', 'GitHub for Data', 'Portfolio builder', 'LinkedIn optimization'],
        detailedContent: 'Realizarás un análisis completo de un dataset real, desde la limpieza hasta la presentación de conclusiones ejecutivas. Este es el proyecto que pondrás en tu portfolio.',
        seniorTip: 'Documenta tu proceso en GitHub. Los reclutadores quieren ver CÓMO piensas, no solo el resultado.',
        challenge: {
          question: '¿Qué plataforma es ideal para publicar notebooks de análisis de datos?',
          options: ['Instagram', 'GitHub', 'Spotify', 'TikTok'],
          correctAnswer: 1,
          explanation: 'GitHub permite compartir código, notebooks y visualizaciones de forma profesional y versionada.'
        }
      }
    ]
  }
};

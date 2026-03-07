import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tfit-secret-2025';
const DB_PATH = path.join(__dirname, 'tfit-db.json');

// ─── DATABASE (JSON file, sin compilacion nativa) ────────────────────────────
interface UserRecord {
  id: number;
  email: string;
  password: string;
  courseChosen: string | null;
  lastStepCompleted: number;
  certificateIssued: boolean;
  certificateId: string | null;
  createdAt: string;
}

interface DB {
  users: UserRecord[];
  nextId: number;
}

function readDB(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const initial: DB = { users: [], nextId: 1 };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

console.log('Base de datos lista (tfit-db.json)');

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalido' });
  }
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contrasena requeridos' });
  if (password.length < 4) return res.status(400).json({ error: 'La contrasena debe tener al menos 4 caracteres' });

  const db = readDB();
  if (db.users.find(u => u.email === email.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Este email ya esta registrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser: UserRecord = {
    id: db.nextId++,
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    courseChosen: null,
    lastStepCompleted: -1,
    certificateIssued: false,
    certificateId: null,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: newUser.id, email: newUser.email, courseChosen: null, lastStepCompleted: -1 } });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contrasena requeridos' });

  const db = readDB();
  const user = db.users.find(u => u.email === email.trim().toLowerCase());
  if (!user) return res.status(401).json({ error: 'Email o contrasena incorrectos' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Email o contrasena incorrectos' });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, email: user.email, courseChosen: user.courseChosen, lastStepCompleted: user.lastStepCompleted, certificateIssued: user.certificateIssued } });
});

// ─── ME ───────────────────────────────────────────────────────────────────────
app.get('/api/me', authMiddleware, (req: any, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ id: user.id, email: user.email, courseChosen: user.courseChosen, lastStepCompleted: user.lastStepCompleted, certificateIssued: user.certificateIssued });
});

// ─── COURSE ───────────────────────────────────────────────────────────────────
app.put('/api/course', authMiddleware, (req: any, res) => {
  const { courseChosen } = req.body;
  if (!['web', 'data'].includes(courseChosen)) return res.status(400).json({ error: 'Curso invalido' });
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  user.courseChosen = courseChosen;
  user.lastStepCompleted = -1;
  writeDB(db);
  res.json({ success: true });
});

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
app.put('/api/progress', authMiddleware, (req: any, res) => {
  const { lastStepCompleted } = req.body;
  if (typeof lastStepCompleted !== 'number') return res.status(400).json({ error: 'Paso invalido' });
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (lastStepCompleted > user.lastStepCompleted) {
    user.lastStepCompleted = lastStepCompleted;
  }
  if (lastStepCompleted >= 9 && !user.certificateIssued) {
    user.certificateIssued = true;
    user.certificateId = 'TFIT-' + Date.now().toString(36).toUpperCase();
  }
  writeDB(db);
  res.json({ success: true });
});

// ─── STATIC (produccion) ──────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Tu Futuro IT API corriendo en http://localhost:' + PORT);
});

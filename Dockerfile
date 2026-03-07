FROM node:20-slim
WORKDIR /app

# Instalar dependencias del sistema para better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias del backend
COPY package*.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Build del frontend
RUN npm run build:frontend

EXPOSE 3001
CMD ["npm", "start"]

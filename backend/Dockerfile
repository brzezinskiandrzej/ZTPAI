# ===============================
# Stage 1: Build (TypeScript -> JS)
# ===============================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instalacja zależności (npm ci / yarn install --frozen-lockfile)
RUN npm ci

# Kopiujemy cały kod
COPY . .

# Kompilujemy TypeScript -> JavaScript (zakładamy "build" skrypt w package.json)
RUN npm run build

# ===============================
# Stage 2: Production image
# ===============================
FROM node:18-alpine

# Dla bezpieczeństwa dodajemy użytkownika nie-root
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
USER nodeuser

WORKDIR /app

# Kopiujemy skompilowany kod i zainstalowane zależności
# UWAGA: Jeśli używasz np. NestJS, pliki wynikowe to "/app/dist".
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Zależnie od struktury projektu, czasem kopiujemy package*.json, jeśli nasz app wymaga ich w runtime

EXPOSE 5000

# Zmienna środowiskowa na wypadek, gdybyśmy mieli inny port
ENV PORT=5000

# Uruchamiamy Node na skompilowanej aplikacji
CMD ["node", "dist/main.js"]

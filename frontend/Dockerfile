# ===============================
# Stage 1: Build React app
# ===============================
FROM node:18-alpine AS builder

# Ustawiamy katalog roboczy wewnątrz kontenera
WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider

# Kopiujemy pliki package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności w oparciu o plik package-lock.json
RUN npm ci

# Teraz kopiujemy resztę plików projektu (src, public, itp.)
COPY . .

# Budujemy aplikację React (statyczne pliki pojawią się w /app/build)
RUN npm run build

# ===============================
# Stage 2: Nginx do serwowania
# ===============================
FROM nginx:stable-alpine

# Usuwamy domyślną konfigurację hosta, jeśli potrzebujemy własnego configu:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiujemy skompilowane pliki z etapu "builder"
COPY --from=builder /app/build /usr/share/nginx/html

# Exponujemy port 80
EXPOSE 80

# Uruchamiamy Nginx w trybie pierwszoplanowym
CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
ENV NODE_ENV=production
RUN npm run build


FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist            
COPY --from=builder /app/node_modules ./node_modules  

RUN npm prune --production





CMD ["node", "dist/src/server.js"] 

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
CMD ["sh", "-c", "npm run migration:run && node dist/src/index.js"]

FROM node:18-alpine


RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
USER nodeuser

WORKDIR /app


COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules


EXPOSE 5000

ENV PORT=5000

CMD ["node", "dist/main.js"]

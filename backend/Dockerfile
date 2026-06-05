FROM node:24-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend/ ./
COPY ai/household_daily_clean.csv /app/ai/household_daily_clean.csv

RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 5000

CMD ["node", "server.js"]

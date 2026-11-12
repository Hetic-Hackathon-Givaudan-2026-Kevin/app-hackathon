# Image du front Next.js.
# Contexte de build : la racine du repo (voir compose.yaml), car les dépendances
# sont gérées par les workspaces npm de la racine.
FROM node:20-alpine

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Installation des dépendances (devDependencies comprises : nécessaires au build)
COPY . .
RUN --mount=type=cache,target=/root/.npm npm ci

# Build de production
RUN npm run build --workspace web

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "web", "--", "-H", "0.0.0.0", "-p", "3000"]
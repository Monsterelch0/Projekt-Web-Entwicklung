# frontend/Dockerfile

# 1. Build-Phase
FROM node:18 AS build-stage
WORKDIR /app

# Installiere pnpm global im Image
RUN npm install -g pnpm

# Kopiere zuerst package.json und die pnpm-lock.yaml Datei
# Dies nutzt Docker's Layer-Caching.
COPY package.json pnpm-lock.yaml* ./ 
# Falls du eine .npmrc oder .pnpmfile.cjs für pnpm hast, kopiere die auch:
# COPY .npmrc ./ 
# COPY .pnpmfile.cjs ./

# Installiere Abhängigkeiten mit pnpm.
# --frozen-lockfile ist Best Practice für CI/Docker.
RUN pnpm install --frozen-lockfile

# Kopiere den Rest deines Frontend-Quellcodes
COPY . .

# Baue die Anwendung mit pnpm
# Dieser Befehl sollte dem "build"-Skript in deiner package.json entsprechen
RUN pnpm run build

# 2. Run-Phase (leichter Webserver für die statischen Dateien aus dem Build)
FROM node:18-alpine 

# Installiere 'serve' global, um die statischen Dateien auszuliefern
RUN npm install -g serve

WORKDIR /app

# Kopiere nur die gebauten Artefakte aus der Build-Phase
# Stelle sicher, dass der Output-Ordner deines Vite-Builds 'dist' heißt.
COPY --from=build-stage /app/dist .

EXPOSE 5173

# Starte 'serve'
CMD ["serve", "-s", ".", "-l", "5173"]

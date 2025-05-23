# 1. Build-Phase
FROM node:18 AS build-stage # Benenne die Stage für Klarheit
WORKDIR /app

# Installiere pnpm global
RUN npm install -g pnpm

# Kopiere zuerst package.json und die pnpm-lock.yaml Datei
# Dies nutzt Docker's Layer-Caching: Wenn sich diese Dateien nicht ändern,
# müssen die Dependencies nicht bei jedem Build neu installiert werden.
COPY package.json pnpm-lock.yaml* ./ 
# Falls du eine .npmrc oder .pnpmfile.cjs für pnpm hast, kopiere die auch:
# COPY .npmrc ./ 
# COPY .pnpmfile.cjs ./

# Installiere Abhängigkeiten mit pnpm
# --frozen-lockfile ist Best Practice für CI/Docker, um sicherzustellen,
# dass exakt die Versionen aus der Lock-Datei installiert werden.
RUN pnpm install --frozen-lockfile

# Kopiere den Rest deines Quellcodes
COPY . .

# Baue die Anwendung mit pnpm
RUN pnpm run build

# 2. Run-Phase (leichter Webserver für die statischen Dateien aus dem Build)
FROM node:18-alpine # Verwende ein leichtes Image für die Run-Phase

# Installiere 'serve' global, um die statischen Dateien auszuliefern
RUN npm install -g serve 
# Alternativ, wenn du pnpm auch hier verwenden willst (optional für serve):
# RUN apk add --no-cache pnpm && pnpm add -g serve 
# (pnpm in alpine zu bekommen kann etwas anders sein als npm install -g pnpm)
# Für 'serve' ist 'npm install -g serve' oft ausreichend und einfach.

WORKDIR /app

# Kopiere nur die gebauten Artefakte aus der Build-Phase
COPY --from=build-stage /app/dist . 
# Stelle sicher, dass der Output-Ordner deines Vite-Builds wirklich 'dist' heißt.
# Er ist in deiner package.json im "build"-Skript definiert (tsc -b && vite build)

EXPOSE 5173

# Starte 'serve', um den Inhalt des aktuellen Verzeichnisses (wo 'dist' hinkopiert wurde)
# auf Port 5173 auszuliefern.
# '-s' bedeutet, dass es als Single-Page-Application behandelt wird (gut für React Router).
CMD ["serve", "-s", ".", "-l", "5173"]

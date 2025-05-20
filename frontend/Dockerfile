# 1. Build-Phase
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2. Run-Phase (leichter Webserver)
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 5173
CMD ["serve", "-s", ".", "-l", "5173"]

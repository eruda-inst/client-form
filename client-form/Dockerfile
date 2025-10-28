# Use a Node.js base image
FROM node:20-alpine AS base

# --- MUDANÇA 1: Usar um PLACEHOLDER ---
ARG NEXT_PUBLIC_API_URL=__NEXT_PUBLIC_API_URL_PLACEHOLDER__
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set the working directory inside the container
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

# O build vai usar o placeholder
RUN npm run build

# Production stage: Use a smaller image for serving
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# --- MUDANÇA 2: Adicionar o script de entrypoint ---
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000

# --- MUDANÇA 3: Definir o Entrypoint e o CMD ---
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]
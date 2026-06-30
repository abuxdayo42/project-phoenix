# ==========================================
# Stage 1 - Build Stage
# ==========================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy project
COPY . .

# Build frontend
RUN npm run build


# ==========================================
# Stage 2 - Production Stage
# ==========================================

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev \
    && npm cache clean --force

# Copy backend
COPY index.js .

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Run as non-root user
USER node

EXPOSE 5000

CMD ["npm", "start"]
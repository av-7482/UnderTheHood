# =========================
# Stage 1: Build frontend
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm ci

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
RUN npm ci --prefix frontend

# Copy application source code
COPY backend ./backend
COPY frontend ./frontend

# Build React frontend
RUN npm run build --prefix frontend


# =========================
# Stage 2: Production
# =========================
FROM node:22-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install only production backend dependencies
RUN npm ci --omit=dev

# Copy backend source
COPY backend ./backend

# Copy React production build from builder
COPY --from=builder /app/frontend/dist ./frontend/dist

# Express listens on port 5000 by default
EXPOSE 5000

CMD ["node", "backend/server.js"]
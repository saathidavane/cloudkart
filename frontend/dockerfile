# ============================================================
# Stage 1: Build the React app
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
# The build output goes to /app/dist (Vite default)
COPY . .

# Build arguments for API URLs (injected at build time)
# In production, these are replaced with the real service URLs
ARG VITE_USER_API
ARG VITE_PRODUCT_API
ARG VITE_CART_API
ARG VITE_ORDER_API

ENV VITE_USER_API=${VITE_USER_API}
ENV VITE_PRODUCT_API=${VITE_PRODUCT_API}
ENV VITE_CART_API=${VITE_CART_API}
ENV VITE_ORDER_API=${VITE_ORDER_API}

RUN npm run build

# ============================================================
# Stage 2: Serve with Nginx
# ============================================================
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from builder stage
# /dist → /usr/share/nginx/html is where Nginx serves static files from
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx runs as root internally (needed to bind port 80)
# but the worker processes run as 'nginx' user
EXPOSE 80

# nginx -g "daemon off" keeps Nginx in the foreground
# Docker containers need the main process to run in foreground
CMD ["nginx", "-g", "daemon off;"]
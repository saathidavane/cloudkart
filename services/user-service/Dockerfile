# ============================================================
# Stage 1: Dependencies installation
# We use node:20-alpine (not full node:20) because:
# - alpine is ~5MB vs ~100MB for debian-based
# - Fewer packages = smaller attack surface
# ============================================================
FROM node:20-alpine AS deps

# Set working directory inside the container
WORKDIR /app

# Copy ONLY package files first (not all source code)
# Why? Docker layer caching. If package.json doesn't change,
# this layer is cached and npm install is skipped on rebuild.
COPY package*.json ./

# Install production dependencies only
# --omit=dev skips devDependencies (nodemon, etc.)
RUN npm ci --omit=dev

# ============================================================
# Stage 2: Production image
# ============================================================
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
# Never run Node.js apps as root in production
RUN addgroup -S cloudcart && adduser -S cloudcart -G cloudcart

# Copy dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY src/ ./src/
COPY package.json ./

# Set ownership to non-root user
RUN chown -R cloudcart:cloudcart /app

# Switch to non-root user
USER cloudcart

# Document which port the app uses
EXPOSE 3001

# Use an array form (not string) for the CMD
# Array form = exec form (PID 1) → proper signal handling
# String form = shell form → sh -c "node src/index.js" (wrong)
CMD ["node", "src/index.js"]
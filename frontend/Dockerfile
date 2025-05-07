FROM node:20-slim

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Set environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Disable Turbopack for better Docker compatibility
CMD ["pnpm", "dev"]
FROM node:20-slim AS base

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Conditionally install @libsql/linux-arm64-musl on ARM64
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then pnpm add @libsql/linux-arm64-musl; fi

# Main build stage
FROM base

# Set environment
ENV NODE_ENV=development

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy rest of the app
COPY . .
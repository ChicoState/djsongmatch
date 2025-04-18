FROM node:20-slim AS base

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Only copy package files for dependency install
COPY package.json pnpm-lock.yaml ./

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Final development stage
FROM base

ENV NODE_ENV=development

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Do NOT copy source code — it will be mounted via docker-compose for hot reload

CMD ["pnpm", "dev"]

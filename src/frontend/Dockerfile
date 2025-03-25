# Use Node.js 18 as the base image
FROM node:18 AS builder

# Set working directory
WORKDIR /service

# Ensure all necessary environment variables are set
ENV NODE_ENV=development

COPY package.json package-lock.json ./

# Copy the rest of the project files
COPY . .

RUN npm install --include=dev

# Conditionally install @libsql/linux-arm64-musl only on ARM64 builds.
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then npm install @libsql/linux-arm64-musl; fi

EXPOSE 3000

# Start the Next.js server in development mode
CMD ["npm", "run", "dev"]

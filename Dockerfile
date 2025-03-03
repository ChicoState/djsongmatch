# Use Node.js 18 as the base image
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Next.js project
RUN npm run build

# Use a lightweight runtime image to run the app
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy the built project from the builder stage
COPY --from=builder /app ./

# Expose the Next.js default port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]

# Use Node.js 18 as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching layers)
COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of the project files
COPY . .

RUN npm run build

EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]

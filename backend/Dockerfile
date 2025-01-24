# backend/Dockerfile

# Development Stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Start development server
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install --production

# Copy built assets
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Start production server
CMD ["npm", "start"]
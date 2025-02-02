# backend/Dockerfile

# Development Stage
FROM node:23-bullseye AS development

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
FROM node:23-bullseye AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install

# Copy built assets
COPY . .

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

# Start production server
CMD ["npm","run", "start"]
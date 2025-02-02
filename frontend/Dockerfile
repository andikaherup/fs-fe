# frontend/Dockerfile

# Development Stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Start development server
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Start production server
CMD ["npm","run" ,"start"]
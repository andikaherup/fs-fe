# Maintenance Request Management System

## Overview

A full-stack application for managing maintenance requests with real-time updates and automatic urgency escalation. The system allows users to create, track, and resolve maintenance requests with different urgency levels.

## Features

- Real-time updates for request changes
- Automatic urgency level escalation:
- Less Urgent → Urgent (after 3 days)
- Urgent → Emergency (after 6 hours)
- Status tracking (Open/Resolved)
- Request metrics dashboard
- GraphQL API with real-time subscriptions

## Tech Stack

### Backend

- Node.js with TypeScript
- Apollo Server for GraphQL
- Type-GraphQL
- PostgreSQL with Prisma ORM
- WebSocket for real-time updates

### Frontend

- Next.js
- Apollo Client
- TailwindCSS
- TypeScript

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- npm

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/andikaherup/fs-fe
cd maintenance-management
```

2. Add .env file

```bash
.env example

# Database ( this will be available soon in docker, or not )
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=maintenance_system

#since docker config still have some bug please use this database URL
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/maintenance_system


# Backend
NODE_ENV=development
PORT=4000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

3. Local Development test

```bash
# Backend

cd backend
npm install
npm run dev

# Frontend

cd frontend
npm install
npm run dev

```

Building for Production

```bash
docker-compose -f docker-compose.yml up --build
```

Manual build:

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build

```

## PROJECT STRUCTURE

```bash
maintenance-management/
├── backend/
│ ├── src/
│ │ ├── resolver/
│ │ ├── services/
│ │ └── types/
│ ├── prisma/
│ │ └── schema.prisma
│ └── Dockerfile
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── graphql/
│ │ └── pages/
│ └── Dockerfile
└── docker-compose.yml
```

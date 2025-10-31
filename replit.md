# Marka OS - School Operating System

## Overview
Marka OS is a comprehensive school management platform built with React, TypeScript, and Vite. It helps schools manage students, teachers, finance, and reports in one powerful platform targeting the Ugandan education system.

## Project Structure
This is a frontend-only application that connects to a separate backend API.

### Key Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives

### Directory Structure
```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable React components
│   ├── dialogs/     # Dialog components
│   ├── forms/       # Form components
│   ├── layout/      # Layout components
│   ├── modals/      # Modal components
│   ├── tables/      # Table components
│   └── ui/          # Base UI components (shadcn/ui)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
│   ├── auth/        # Authentication utilities
│   ├── api.ts       # API client
│   └── queryClient.ts # React Query client
├── pages/           # Page components (routes)
├── stores/          # Zustand stores
└── types/           # TypeScript type definitions
```

## Setup and Configuration

### Environment Variables
The application requires the following environment variables:

- `VITE_APP_API_BASE_URL`: The URL of the backend API server
- `VITE_NODE_ENV`: The environment (development/production/testing)

These should be set in Replit Secrets for security.

### Installation
Dependencies are already installed via npm. To reinstall:
```bash
npm install
```

### Development
The development server runs on port 5000 (required for Replit):
```bash
npm run dev
```

### Build
To create a production build:
```bash
npm run build
```

## Replit Environment Configuration

### Workflows
- **dev-server**: Runs the Vite development server on port 5000 with webview output

### Port Configuration
- Frontend: Port 5000 (configured for Replit webview)
- The server is configured to listen on 0.0.0.0 to work with Replit's proxy

### Backend Integration
This frontend application expects a separate backend API. The API base URL must be configured via the `VITE_APP_API_BASE_URL` environment variable. All API requests are made through the `apiRequest` function in `src/lib/queryClient.ts`, which:
- Automatically includes authentication tokens
- Handles CORS
- Manages error responses
- Logs out users on 401 responses (except auth endpoints)

## Features
Based on the pages structure, the application includes:
- **Landing Page**: Marketing and information
- **Authentication**: Login, Register, Email Verification
- **Dashboard**: Main application dashboard
- **School Management**: Manage school information
- **Student Management**: Student records and data
- **Subject Management**: Curriculum and subjects
- **Assessment System**: Student assessments and grading
- **Analytics**: Data visualization and insights
- **Reports**: Generate various reports
- **Legal**: Privacy policy and terms of service

## Recent Changes
- **2025-10-31**: Initial Replit setup
  - Configured Vite to run on port 5000 with 0.0.0.0 host
  - Set up workflow for development server with webview output
  - Installed all npm dependencies
  - Verified application loads correctly in Replit environment

## User Preferences
None recorded yet.

## Notes
- The application is production-ready for frontend deployment
- Backend API integration is required for full functionality
- All authentication and data management happens through the backend API
- The app uses service workers for offline capabilities

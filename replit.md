# Overview

This is a full-stack AI chat application built with React, Express, TypeScript, and PostgreSQL. The application allows users to create conversations and interact with an AI assistant powered by OpenAI's GPT models. It features a modern chat interface with conversation management, message history, and real-time interactions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and building
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and API interactions
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS custom properties for theming, supporting both light and dark modes

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Request Logging**: Custom middleware for API request logging with timing and response data

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Storage**: Fallback MemStorage class for development/testing without database connection

## Database Schema
- **Conversations**: Store chat conversation metadata (id, title, timestamps)
- **Messages**: Store individual chat messages with conversation references and role-based content (user/assistant)
- **Users**: Basic user management with username and password (prepared for future authentication)

## Authentication and Authorization
- Currently implements basic user schema preparation but no active authentication system
- Session management infrastructure present but not actively used
- Designed for future implementation of user authentication and conversation ownership

## API Structure
- **Conversation Management**: CRUD operations for chat conversations
- **Message Handling**: Create and retrieve messages within conversations
- **Real-time Chat**: Integration with OpenAI API for generating AI responses
- **Auto-titling**: Automatic conversation title generation based on first user message

## Component Architecture
- **Layout Components**: Header, theme provider, and responsive mobile/desktop layouts
- **Chat Components**: Modular chat interface with sidebar, message list, and input components
- **UI Components**: Comprehensive component library using Radix UI primitives
- **Hooks**: Custom React hooks for mobile detection and toast notifications

## Development and Build System
- **Development Server**: Vite with HMR and custom middleware integration
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Asset Management**: Static asset serving with development and production configurations

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Neon's serverless PostgreSQL driver for database connections
- **drizzle-orm**: TypeScript ORM for database operations and query building
- **express**: Web framework for the Node.js backend server

## UI and Frontend Libraries
- **@radix-ui/***: Complete set of accessible UI primitives for building the interface
- **@tanstack/react-query**: Powerful data synchronization for React applications
- **tailwindcss**: Utility-first CSS framework for styling
- **wouter**: Minimalist routing library for React applications

## AI Integration
- **OpenAI**: Official OpenAI SDK for GPT model integration and chat completion generation
- Uses GPT-5 model for AI responses (configured in the OpenAI service)

## Development Tools
- **vite**: Fast build tool and development server for the frontend
- **tsx**: TypeScript execution environment for Node.js development
- **esbuild**: Fast JavaScript bundler for server-side code compilation
- **drizzle-kit**: CLI tools for database schema management and migrations

## Utility Libraries
- **zod**: TypeScript-first schema validation library
- **date-fns**: Modern JavaScript date utility library
- **clsx & tailwind-merge**: Conditional CSS class utilities for dynamic styling
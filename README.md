# AI Study Hub FPT

AI Study Hub FPT is an AI-powered academic resource-sharing platform developed for FPT University students.

The system provides a centralized environment where students can upload, discover, organize, share, and discuss learning materials. It also integrates AI assistance to help users understand academic content more effectively.

## Overview

AI Study Hub FPT aims to solve the problem of learning materials being scattered across Facebook groups, Messenger, Google Drive, email, and personal devices. The platform brings these resources together in one secure and searchable environment.

## Objectives

### Main Goals

- Centralize learning resources
- Improve document discoverability
- Encourage academic sharing among students
- Integrate AI-powered learning assistance
- Provide a secure and scalable platform

### Target Users

- FPT University students
- Academic communities
- System administrators

## Key Features

### User Management

- Register and manage accounts
- Login and logout
- Manage user profiles
- Student identity verification
- Role-based authorization

### Document Management

- Upload, edit, and delete documents
- Organize documents into folders
- Categorize and tag documents
- Browse and search academic resources
- Preview and download documents

### Community Features

- Comment on documents
- Rate documents
- Add documents to favorites
- Share documents with other users
- Report inappropriate documents

### AI Features

Users can chat with an AI assistant to:

- Ask questions about uploaded materials
- Receive AI-generated explanations
- Understand concepts faster through contextual responses

#### Current AI Scope

The system currently supports AI chat with document context.

AI Summary, AI Flashcards, and AI Quiz content is generated in real time and is intentionally not persisted.

### Subscription Features

| Plan | Description |
| --- | --- |
| Free | Limited storage and AI requests |
| Pro | Increased storage and more AI requests |
| Premium | Maximum storage and extended AI usage |

### Admin Features

- Manage users
- Review student verification requests
- Review, approve, and reject uploaded documents
- Review and resolve user reports
- Manage majors, courses, categories, and subscription plans

## System Architecture

### External Systems

- **Gemini AI API** — AI chat processing and context-aware responses
- **Firebase Storage** — document files, document assets, and thumbnails

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios

### Backend

- Java Spring Boot
- Spring Security
- JWT authentication
- RESTful API
- Maven

### Database and Storage

- MySQL
- Firebase Storage

### AI and Version Control

- Google Gemini API
- Git and GitHub

## Database Overview

### Main Modules

- **Authentication:** `users`, `roles`, `user_roles`, `refresh_tokens`, `student_verifications`
- **Academic Structure:** `majors`, `courses`
- **Document Management:** `folders`, `documents`, `document_categories`, `tags`, `document_tags`
- **Community:** `comments`, `favorites`, `document_ratings`, `document_shares`, `reports`
- **Analytics:** `document_views`, `document_downloads`, `activity_logs`
- **AI Module:** `chat_sessions`, `chat_messages`
- **Subscription:** `subscription_plans`, `user_subscriptions`
- **Notification:** `notifications`

## Main Use Cases

### Student

- Register and log in
- Verify student identity
- Manage profile
- Upload and manage documents
- Browse, search, preview, and download documents
- Share, comment on, rate, favorite, and report documents
- Chat with AI and view chat history
- Purchase a subscription plan

### Admin

- Manage users
- Review and moderate documents
- Approve or reject documents
- Review and resolve reports
- Review student verification requests
- Manage courses, categories, and subscription plans

## Project Structure

```text
AIStudyHubFPT
├── FE
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   └── assets
│   └── public
│
├── backend
│   └── BE
│       ├── src/main/java
│       │   └── com/teamg5/be
│       │       ├── controller
│       │       ├── service
│       │       ├── repository
│       │       ├── entity
│       │       ├── dto
│       │       ├── config
│       │       └── security
│       └── pom.xml
│
├── docs
└── README.md
```

## Getting Started

### Frontend

```bash
cd FE
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run preview
```

### Backend

On Windows:

```bash
cd backend/BE
./mvnw.cmd spring-boot:run
```

On macOS or Linux:

```bash
cd backend/BE
./mvnw spring-boot:run
```

Configure database, JWT, Firebase, and Gemini API settings in `backend/BE/src/main/resources/application.properties` before running the backend.

## Future Enhancements

- AI summary generation
- AI flashcards generation
- AI quiz generation
- Recommendation engine
- Vector search integration
- Learning analytics dashboard
- Mobile application

## Contributors

SWP391 Project Team  
AI Study Hub FPT  
FPT University  
Summer 2026

# ChayNow

ChayNow is a web application for discovering vegetarian restaurants, dishes, events, community posts, and managing restaurant information.

The project includes a React frontend and a Java Spring Boot backend. Users can explore vegetarian food options, save favorites, interact with community content, and restaurant owners can manage their businesses through dedicated screens.

## Main Features

### Public Features

- Discover vegetarian restaurants
- View restaurant details, dishes, events, and reviews
- Search and filter restaurant content
- View community posts
- View restaurant locations and map information

### Authentication and User Features

- Register and log in
- Persist authentication state
- Role-based protected routes
- Manage user profile
- Save and view favorite restaurants

### Restaurant Owner Features

- Select and manage restaurants
- Edit restaurant information
- Manage dishes
- Manage events
- View and manage restaurant reviews
- View restaurant dashboard information

### Admin Features

- Manage users
- Moderate restaurants and locations
- Moderate community posts

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand for persisted authentication state
- Axios for API requests
- Framer Motion for animations
- Recharts for dashboard charts
- Lucide React and Radix/shadcn-style UI components

### Backend

- Java 17
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Bean Validation
- Lombok
- Microsoft SQL Server
- Maven

## Project Structure

```text
swd392-fe
├── FE
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── data
│   │   ├── hooks
│   │   ├── lib
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── store
│   │   └── types
│   ├── package.json
│   └── vite.config.ts
│
├── backend
│   └── BE
│       ├── src/main/java
│       ├── src/main/resources
│       ├── src/test
│       ├── docker-compose.yml
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

Available scripts:

```bash
npm run build
npm run lint
npm run preview
```

Frontend environment configuration is stored in `FE/.env.local`.

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

Backend configuration is stored in `backend/BE/src/main/resources/application.properties`.

## Development Notes

- API calls are organized in `FE/src/services`.
- Authentication state is managed in `FE/src/store/authStore.ts`.
- Route definitions and protected routes are located in `FE/src/routes`.
- Some screens currently use demo or mock data from `FE/src/data`.
- Owner flows and some management screens are not fully connected to backend APIs yet.

## Current Limitations

- Several public and owner screens still use local or demo data.
- Owner management flows are partially implemented.
- Additional automated tests are needed for authentication, protected routing, and moderation flows.

## Contributors

SWP391 Project Team  
ChayNow  
FPT University

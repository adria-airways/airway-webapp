# Airway

Airway is a web app for tracking airplane traffic and weather data on a map.
The project was built as a monorepo with separated frontend, backend and data model.

## 1. Frameworks and tools:

### Frontend:
- React
- Vite
- Typescript
- TailwindCSS
- Clerk

### Backend:
- Express.js
- Zod
- Swagger / OpenAPI
- Clerk

### Database:
- PostgreSQL
- Drizzle ORM

### External data sources:
- OpenSky Network for airplane data
- ARSO API for weather data
- ADSBDB for flight route data

## 2. Project specification:

The application is divided into three main sections:
- `apps/web` - frontend interface
- `apps/api` - Express.js REST API
- `packages/db` - database schema, migrations, configuration

Backend fetches data in the background using cron jobs and stores it into PostgreSQL database.

## 3. Installation and setup instructions:

### Requirements:
- Node.js 20 or newer
- pnpm
- PostgreSQL database
- Clerk project for authentication

Install `pnpm`:
```bash
npm install -g pnpm
```

### Install dependencies:
From the project root directory run:
```
pnpm install
```

If a build warning shows:
```
pnpm approve-builds
```

### Environment variables:
For the database, create `.env` file in: `packages/db/.env`
```
DATABASE_URL=
```

For the backend, create `.env` in: `apps/api/.env`
```
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
DESKTOP_TOKEN_SECRET=
OPENSKY_CLIENT_ID=
OPENSKY_CLIENT_SECRET=
```

For the frontend, create `.env` in: `apps/web/.env`
```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL=
```

### Database migrations:
After configuring connection, run the migrations:
```
pnpm db:migrate
```

If needed, seed the preset data:
```
pnpm db:seed
```

### Clerk setup:
An organization is needed, to set up custom permissions:
```
org:desktop_app:access

org:locations:read
org:locations:manage

org:planes:read
org:planes:manage

org:weather:read
org:weather:manage
```

Regular users, have access to `/app` endpoints only, while admin users have custom permission to access CRUD endpoints.

## 4. Run the application:
Start the project from root directory:
```
pnpm dev
```

Default URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Documentation: `http://localhost:3001/api/docs`

Sections can be started separately:
```
pnpm dev:web
pnpm dev:api
```

## 5. Login instructions:
The app uses Clerk for authentication, user opens the website and signs in through Clerk login flow.
After a successful login, dashboard access is granted at `/dashboard`.
Frontend sends a Bearer token with API requests, which the backend verifies through Clerk middleware and allows access to protected endpoints.

## 6. Use cases:

### **Viewing current air traffic**
User opens the dashboard and sees current aircraft on the map. Each aircraft is displayed with an icon that routes according to its heading.
Clicking an aircraft shows basic information such as callsign, origin country, position, and when available, route information.

### **Searching and filtering aircraft**
The user can filter the aircraft list by:
- callsign
- airline
- proximity to the user's current location

When an aircraft is selected from the list, the map moves to its current location.

### **Viewing historical air traffic**
The app stores time snapshots of air traffic. The user can switch from live mode to historical mode using the timeline feature and inspect
aircraft positions at a selected point in time.

### **Displaying weather data**
Weather stations are displayed on the map. The user can enable or disable the weather layer and inspect weather data related to specific locations or selected times.

### **Changing map display**
The user can choose between different map styles:
- standard map
- dark map
- topographic map
- satellite map

The aircraft layer and weather station layer can also be enabled or disable independently.

### Data model:
The database contains schemas for:
- live aircraft
- historical aircraft snapshots
- aircraft route data
- weather locations
- weather readings
- regions
- authentication and session data

## 7. Useful scripts
```
pnpm dev          # start frontend + backend
pnpm dev:web      # start only frontend
pnpm dev:api      # start only backend

pnpm db:generate  # generate Drizzle migrations
pnpm db:migrate   # run migrations
pnpm db:studio    # open Drizzle studio
pnpm db:seed      # insert initial weather data
```

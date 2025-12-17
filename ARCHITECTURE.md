# Architecture Documentation

## System Overview

The Video Processing Application follows a modern full-stack architecture with clear separation of concerns between frontend and backend.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │         React Frontend (Vite + TypeScript)          │    │
│  │  - UI Components (Tailwind CSS)                     │    │
│  │  - State Management (React Context)                 │    │
│  │  - API Client (Axios)                               │    │
│  │  - Routing (React Router)                           │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │ HTTP/REST API
┌───────────────────────────┼───────────────────────────────────┐
│                           ▼                                   │
│                     SERVER LAYER                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │       Express Backend (Node.js + TypeScript)        │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │           Middleware Layer                   │   │    │
│  │  │  - Authentication (JWT)                      │   │    │
│  │  │  - Authorization (RBAC)                      │   │    │
│  │  │  - Validation                                │   │    │
│  │  │  - Error Handling                            │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  │                       │                              │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │         Module Layer (Business Logic)        │   │    │
│  │  │  - Auth Module (register, login, logout)    │   │    │
│  │  │  - Video Module (CRUD operations)           │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  │                       │                              │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │           Data Access Layer                  │   │    │
│  │  │  - Mongoose Models                           │   │    │
│  │  │  - Schema Definitions                        │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │ MongoDB Driver
┌───────────────────────────┼───────────────────────────────────┐
│                           ▼                                   │
│                    DATABASE LAYER                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │              MongoDB Database                       │    │
│  │  - Users Collection                                 │    │
│  │  - Roles Collection                                 │    │
│  │  - Videos Collection                                │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### 1. Modular Structure

The backend follows a modular architecture where each feature is self-contained:

```
backend/src/
├── config/              # Application configuration
│   ├── database.ts      # MongoDB connection setup
│   └── index.ts         # Environment variables
│
├── middlewares/         # Express middleware functions
│   ├── auth.middleware.ts       # JWT token verification
│   ├── rbac.middleware.ts       # Permission checking
│   ├── error.middleware.ts      # Error handling
│   └── validation.middleware.ts # Input validation
│
├── models/             # Mongoose schemas and models
│   ├── User.ts         # User schema with password hashing
│   ├── Role.ts         # Role schema with permissions
│   └── Video.ts        # Video schema with metadata
│
├── modules/            # Feature modules
│   ├── auth/
│   │   ├── auth.controller.ts   # Auth business logic
│   │   └── auth.routes.ts       # Auth route definitions
│   └── video/
│       ├── video.controller.ts  # Video business logic
│       └── video.routes.ts      # Video route definitions
│
├── utils/              # Utility functions
│   └── jwt.ts          # JWT token generation/verification
│
├── scripts/            # Database seeding scripts
│   ├── seedRoles.ts    # Seed default roles
│   └── createAdmin.ts  # Create admin user
│
└── server.ts           # Application entry point
```

### 2. Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  POST /api/auth/login                         │
     │  { email, password }                          │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │  Validate │
     │                                          │ Credentials│
     │                                          └─────┬─────┘
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │ Generate  │
     │                                          │   Tokens  │
     │                                          └─────┬─────┘
     │                                                │
     │  { accessToken, refreshToken, user }          │
     │<──────────────────────────────────────────────┤
     │                                                │
┌────▼─────┐                                         │
│  Store   │                                         │
│  Tokens  │                                         │
└────┬─────┘                                         │
     │                                                │
     │  GET /api/videos                              │
     │  Authorization: Bearer <accessToken>          │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │  Verify   │
     │                                          │   Token   │
     │                                          └─────┬─────┘
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │  Check    │
     │                                          │Permissions│
     │                                          └─────┬─────┘
     │                                                │
     │  { videos: [...] }                            │
     │<──────────────────────────────────────────────┤
     │                                                │
```

### 3. RBAC (Role-Based Access Control)

The system implements a flexible RBAC system:

**Role Structure:**

```typescript
interface IRole {
  name: string; // e.g., 'admin', 'user', 'moderator'
  description: string;
  permissions: string[]; // e.g., ['video:create', 'video:read']
}
```

**Permission Format:**

- `resource:action`
- Examples: `video:create`, `user:delete`, `role:manage`

**Authorization Flow:**

1. User logs in → receives JWT with role information
2. User makes request → JWT verified by `authenticate` middleware
3. Role loaded from database with permissions
4. `authorize` middleware checks if user has required permission
5. Request proceeds or returns 403 Forbidden

### 4. Database Schema Design

#### User Schema

```typescript
{
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  role: ObjectId (ref: Role),
  isActive: Boolean,
  isEmailVerified: Boolean,
  refreshToken: String,
  timestamps: true
}
```

#### Role Schema

```typescript
{
  name: String (enum: admin, user, moderator, editor),
  description: String,
  permissions: [String],
  timestamps: true
}
```

#### Video Schema

```typescript
{
  title: String,
  description: String,
  fileName: String,
  filePath: String,
  fileSize: Number,
  duration: Number,
  thumbnailPath: String,
  status: Enum (uploading, processing, completed, failed),
  uploadedBy: ObjectId (ref: User),
  tags: [String],
  metadata: {
    resolution: String,
    format: String,
    codec: String,
    bitrate: Number
  },
  timestamps: true
}
```

## Frontend Architecture

### 1. Component Structure

```
frontend/src/
├── components/           # Reusable components
│   └── ProtectedRoute.tsx  # Route guard component
│
├── context/             # React Context providers
│   └── AuthContext.tsx     # Global auth state
│
├── pages/              # Page components
│   ├── Login.tsx          # Login page
│   ├── Signup.tsx         # Registration page
│   └── Dashboard.tsx      # Main dashboard
│
├── services/           # API communication
│   ├── api.ts            # Axios instance with interceptors
│   └── authService.ts    # Auth API methods
│
├── App.tsx             # Main app with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles (Tailwind)
```

### 2. State Management

The application uses React Context API for global state management:

**AuthContext Structure:**

```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (email, password) => Promise<void>,
  register: (data) => Promise<void>,
  logout: () => Promise<void>,
  hasPermission: (permission) => boolean
}
```

**State Flow:**

1. App loads → AuthProvider initializes
2. Check localStorage for saved tokens
3. If tokens exist → verify with API
4. Set user state or redirect to login
5. All child components access auth state via `useAuth()` hook

### 3. API Client

The frontend uses Axios with request/response interceptors:

**Request Interceptor:**

- Adds JWT token to Authorization header
- Ensures all authenticated requests include token

**Response Interceptor:**

- Catches 401 errors (token expired)
- Attempts token refresh automatically
- Retries failed request with new token
- Logs out user if refresh fails

### 4. Routing Strategy

```
Route Structure:
/                    → Navigate to /dashboard
/login              → Public (Login page)
/signup             → Public (Signup page)
/dashboard          → Protected (Dashboard page)
```

**Protected Routes:**

- Wrapped with `ProtectedRoute` component
- Checks `isAuthenticated` from AuthContext
- Redirects to `/login` if not authenticated
- Shows loading spinner while checking auth

## Security Features

### 1. Password Security

- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Minimum 6 characters enforced
- Password validation on client and server

### 2. JWT Token Security

- Access tokens: Short-lived (24 hours)
- Refresh tokens: Long-lived (7 days)
- Tokens signed with secret keys
- Token rotation on refresh
- HttpOnly cookies recommended for production

### 3. API Security

- CORS configured for specific origins
- Input validation using express-validator
- SQL injection prevention via Mongoose
- Rate limiting recommended for production
- Error messages don't leak sensitive info

### 4. RBAC Security

- Every protected endpoint checks permissions
- Users can only access resources they're authorized for
- Role changes require re-authentication
- Permissions checked on every request

## Data Flow Examples

### User Registration Flow

```
1. User fills registration form
2. Frontend validates input
3. POST /api/auth/register
4. Backend validates input
5. Check if email exists
6. Hash password
7. Get/create default role
8. Create user document
9. Generate JWT tokens
10. Return user data + tokens
11. Frontend stores tokens
12. Redirect to dashboard
```

### Video Upload Flow

```
1. User selects video file
2. Frontend validates file (type, size)
3. POST /api/videos (multipart/form-data)
4. Auth middleware verifies token
5. RBAC middleware checks video:create permission
6. Multer processes file upload
7. Save file to disk
8. Create video document in DB
9. Return video metadata
10. Frontend updates UI
```

## Performance Considerations

### Backend

- Database indexes on frequently queried fields
- Pagination for list endpoints
- Async/await for non-blocking operations
- Connection pooling for MongoDB
- File size limits for uploads

### Frontend

- Code splitting with React.lazy (recommended)
- Memoization for expensive computations
- Debouncing for search inputs
- Optimistic UI updates
- Image/video lazy loading

## Scalability Considerations

### Horizontal Scaling

- Stateless backend (JWT tokens)
- Multiple backend instances with load balancer
- Shared session store if needed
- Distributed file storage (S3, etc.)

### Database Scaling

- Read replicas for high read load
- Sharding for large datasets
- Indexes for query optimization
- Caching layer (Redis) for frequently accessed data

### File Storage

- Separate file storage service
- CDN for video delivery
- Video transcoding queue
- Thumbnail generation

## Development Workflow

### Backend Development

1. Create feature branch
2. Add/modify models if needed
3. Create/update module (controller + routes)
4. Add middleware if needed
5. Test with Postman/cURL
6. Write unit tests
7. Create pull request

### Frontend Development

1. Create feature branch
2. Design component structure
3. Implement UI with Tailwind
4. Add API service methods
5. Connect to backend
6. Handle loading/error states
7. Test user flow
8. Create pull request

## Testing Strategy

### Backend Testing (Recommended)

- Unit tests for utility functions
- Integration tests for API endpoints
- Test auth middleware
- Test RBAC permissions
- Mock database for tests

### Frontend Testing (Recommended)

- Component unit tests with React Testing Library
- Integration tests for user flows
- Mock API responses
- Test protected routes
- Test form validation

## Deployment Architecture

### Production Setup

```
┌─────────────┐
│   Vercel    │  Frontend (Static)
│   Netlify   │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────┐
│   API GW    │  Optional
└──────┬──────┘
       │
┌──────▼──────┐
│   Backend   │  Node.js on Heroku/Railway/DigitalOcean
│  (Express)  │
└──────┬──────┘
       │
┌──────▼──────┐
│  MongoDB    │  MongoDB Atlas
│   Atlas     │
└─────────────┘
```

## Future Enhancements

1. **Video Processing**

   - FFmpeg integration
   - Video transcoding
   - Thumbnail generation
   - Multiple quality options

2. **Real-time Features**

   - WebSocket for upload progress
   - Live notifications
   - Real-time collaboration

3. **Advanced RBAC**

   - Custom role creation
   - Permission templates
   - Role hierarchy

4. **Analytics**

   - View tracking
   - User analytics
   - Performance metrics

5. **Media Features**
   - Video streaming
   - Adaptive bitrate
   - Subtitles/captions
   - Video editing tools

# Project File Structure

Complete file structure of the Video Processing Application.

```
pulse_assessment/
│
├── README.md                      # Main project documentation
├── SETUP_GUIDE.md                 # Step-by-step setup instructions
├── ARCHITECTURE.md                # Architecture documentation
├── CHEATSHEET.md                  # Quick reference guide
├── .gitignore                     # Git ignore rules
│
├── backend/                       # Backend application
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # MongoDB connection configuration
│   │   │   └── index.ts           # Environment configuration
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts       # JWT authentication middleware
│   │   │   ├── rbac.middleware.ts       # Role-based access control
│   │   │   ├── error.middleware.ts      # Global error handler
│   │   │   └── validation.middleware.ts # Request validation
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts            # User model with password hashing
│   │   │   ├── Role.ts            # Role model with permissions
│   │   │   └── Video.ts           # Video model with metadata
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts   # Auth business logic
│   │   │   │   └── auth.routes.ts       # Auth route definitions
│   │   │   │
│   │   │   └── video/
│   │   │       ├── video.controller.ts  # Video business logic
│   │   │       └── video.routes.ts      # Video route definitions
│   │   │
│   │   ├── utils/
│   │   │   └── jwt.ts             # JWT token utilities
│   │   │
│   │   ├── scripts/
│   │   │   ├── seedRoles.ts       # Database seeding for roles
│   │   │   └── createAdmin.ts     # Create admin user script
│   │   │
│   │   └── server.ts              # Application entry point
│   │
│   ├── uploads/                   # File upload directory (created at runtime)
│   │   └── videos/                # Video files storage
│   │
│   ├── dist/                      # Compiled TypeScript (created on build)
│   │
│   ├── node_modules/              # Dependencies (created on npm install)
│   │
│   ├── package.json               # Backend dependencies and scripts
│   ├── package-lock.json          # Dependency lock file
│   ├── tsconfig.json              # TypeScript configuration
│   ├── nodemon.json               # Nodemon configuration
│   ├── .env.example               # Environment variables template
│   ├── .env                       # Environment variables (create from .env.example)
│   ├── .gitignore                 # Backend-specific git ignore
│   └── README.md                  # Backend documentation
│
└── frontend/                      # Frontend application
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.tsx # Route guard component
    │   │
    │   ├── context/
    │   │   └── AuthContext.tsx    # Authentication context provider
    │   │
    │   ├── pages/
    │   │   ├── Login.tsx          # Login page
    │   │   ├── Signup.tsx         # Registration page
    │   │   └── Dashboard.tsx      # Main dashboard page
    │   │
    │   ├── services/
    │   │   ├── api.ts             # Axios instance with interceptors
    │   │   └── authService.ts     # Authentication API service
    │   │
    │   ├── App.tsx                # Main app component with routing
    │   ├── main.tsx               # Application entry point
    │   ├── index.css              # Global styles with Tailwind
    │   └── vite-env.d.ts          # Vite TypeScript definitions
    │
    ├── public/                    # Static assets
    │
    ├── dist/                      # Production build (created on build)
    │
    ├── node_modules/              # Dependencies (created on npm install)
    │
    ├── package.json               # Frontend dependencies and scripts
    ├── package-lock.json          # Dependency lock file
    ├── tsconfig.json              # TypeScript configuration
    ├── tsconfig.node.json         # TypeScript config for Vite
    ├── vite.config.ts             # Vite configuration
    ├── tailwind.config.js         # Tailwind CSS configuration
    ├── postcss.config.js          # PostCSS configuration
    ├── index.html                 # HTML entry point
    ├── .env.example               # Environment variables template
    ├── .env                       # Environment variables (create from .env.example)
    ├── .gitignore                 # Frontend-specific git ignore
    └── README.md                  # Frontend documentation
```

## File Counts

### Backend

- **Total Files**: ~30
- **TypeScript Files**: 18
- **Configuration Files**: 6
- **Documentation**: 2

### Frontend

- **Total Files**: ~20
- **TypeScript/TSX Files**: 10
- **Configuration Files**: 7
- **Documentation**: 2

## Key Directories

### Backend Directories

- **config/**: Application configuration and database setup
- **middlewares/**: Express middleware for auth, RBAC, validation, errors
- **models/**: Mongoose schemas with TypeScript interfaces
- **modules/**: Feature-based modules (auth, video)
- **utils/**: Utility functions (JWT operations)
- **scripts/**: Database seeding and setup scripts
- **uploads/**: File storage (created at runtime)

### Frontend Directories

- **components/**: Reusable React components
- **context/**: React Context providers for global state
- **pages/**: Page-level components
- **services/**: API communication layer
- **public/**: Static assets

## Generated Directories

These directories are created automatically and should be in .gitignore:

### Backend

- `node_modules/` - Dependencies
- `dist/` - Compiled TypeScript
- `uploads/` - Uploaded files

### Frontend

- `node_modules/` - Dependencies
- `dist/` - Production build

## Configuration Files

### Backend Configuration

1. **package.json** - Dependencies and scripts
2. **tsconfig.json** - TypeScript compiler options
3. **nodemon.json** - Development server configuration
4. **.env** - Environment variables
5. **.gitignore** - Git ignore patterns

### Frontend Configuration

1. **package.json** - Dependencies and scripts
2. **tsconfig.json** - TypeScript compiler options
3. **tsconfig.node.json** - TypeScript for Vite config
4. **vite.config.ts** - Vite build tool configuration
5. **tailwind.config.js** - Tailwind CSS configuration
6. **postcss.config.js** - PostCSS configuration
7. **.env** - Environment variables
8. **.gitignore** - Git ignore patterns

## File Naming Conventions

### TypeScript Files

- **Models**: PascalCase (User.ts, Role.ts, Video.ts)
- **Controllers**: camelCase with .controller suffix (auth.controller.ts)
- **Routes**: camelCase with .routes suffix (auth.routes.ts)
- **Middleware**: camelCase with .middleware suffix (auth.middleware.ts)
- **Utils**: camelCase (jwt.ts)
- **Scripts**: camelCase (seedRoles.ts)

### React Files

- **Components**: PascalCase (ProtectedRoute.tsx)
- **Pages**: PascalCase (Login.tsx, Dashboard.tsx)
- **Context**: PascalCase with Context suffix (AuthContext.tsx)
- **Services**: camelCase with Service suffix (authService.ts)

## Import Path Examples

### Backend

```typescript
// Models
import { User } from "../models/User";

// Middleware
import { authenticate } from "../middlewares/auth.middleware";

// Config
import { config } from "../config";

// Utils
import { generateAccessToken } from "../utils/jwt";
```

### Frontend

```typescript
// Components
import ProtectedRoute from "../components/ProtectedRoute";

// Context
import { useAuth } from "../context/AuthContext";

// Services
import { authService } from "../services/authService";

// Pages
import Login from "../pages/Login";
```

## Module Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                      Backend Modules                         │
│                                                               │
│  server.ts                                                    │
│     │                                                          │
│     ├─→ config/database.ts                                    │
│     ├─→ middlewares/error.middleware.ts                       │
│     │                                                          │
│     ├─→ modules/auth/auth.routes.ts                          │
│     │      ├─→ auth.controller.ts                             │
│     │      ├─→ middlewares/auth.middleware.ts                 │
│     │      ├─→ middlewares/validation.middleware.ts           │
│     │      ├─→ models/User.ts                                 │
│     │      ├─→ models/Role.ts                                 │
│     │      └─→ utils/jwt.ts                                   │
│     │                                                          │
│     └─→ modules/video/video.routes.ts                        │
│            ├─→ video.controller.ts                            │
│            ├─→ middlewares/auth.middleware.ts                 │
│            ├─→ middlewares/rbac.middleware.ts                 │
│            └─→ models/Video.ts                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Frontend Modules                         │
│                                                               │
│  main.tsx                                                     │
│     │                                                          │
│     └─→ App.tsx                                               │
│            │                                                   │
│            ├─→ context/AuthContext.tsx                        │
│            │      └─→ services/authService.ts                 │
│            │             └─→ services/api.ts                  │
│            │                                                   │
│            └─→ React Router                                   │
│                   ├─→ pages/Login.tsx                         │
│                   ├─→ pages/Signup.tsx                        │
│                   └─→ components/ProtectedRoute.tsx           │
│                          └─→ pages/Dashboard.tsx              │
└─────────────────────────────────────────────────────────────┘
```

## Size Estimates

### Source Code Only (excluding node_modules and builds)

**Backend**: ~3-4 MB

- TypeScript files: ~50-60 KB
- Configuration: ~10 KB
- Documentation: ~30 KB

**Frontend**: ~2-3 MB

- TypeScript/TSX files: ~40-50 KB
- Configuration: ~15 KB
- Documentation: ~20 KB

### With Dependencies

**Backend**: ~150-200 MB (node_modules)
**Frontend**: ~250-300 MB (node_modules)

## Lines of Code (Approximate)

**Backend**:

- Models: ~350 lines
- Controllers: ~400 lines
- Middlewares: ~300 lines
- Routes: ~150 lines
- Utils: ~100 lines
- Config: ~80 lines
- **Total**: ~1,380 lines

**Frontend**:

- Components: ~200 lines
- Pages: ~500 lines
- Context: ~150 lines
- Services: ~200 lines
- **Total**: ~1,050 lines

**Project Total**: ~2,430 lines of production code

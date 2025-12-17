# Video Processing Backend

Node.js + Express + TypeScript backend with JWT authentication and RBAC.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration

4. Run development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # MongoDB connection
│   └── index.ts      # App configuration
├── middlewares/      # Express middlewares
│   ├── auth.middleware.ts      # JWT authentication
│   ├── rbac.middleware.ts      # Role-based access control
│   ├── error.middleware.ts     # Error handling
│   └── validation.middleware.ts # Input validation
├── models/          # Mongoose schemas
│   ├── User.ts      # User model
│   ├── Role.ts      # Role model
│   └── Video.ts     # Video model
├── modules/         # Feature modules
│   ├── auth/        # Authentication module
│   │   ├── auth.controller.ts
│   │   └── auth.routes.ts
│   └── video/       # Video module
│       ├── video.controller.ts
│       └── video.routes.ts
├── utils/           # Utility functions
│   └── jwt.ts       # JWT utilities
└── server.ts        # Main server file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Videos

- `POST /api/videos` - Upload video
- `GET /api/videos` - Get all videos
- `GET /api/videos/my-videos` - Get user's videos
- `GET /api/videos/:id` - Get video by ID
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/video_processing
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads
```

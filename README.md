# Video Processing Application

Full-stack video processing application with JWT authentication, RBAC, content sensitivity analysis, video streaming, and multi-tenant architecture. Built with React (Vite), Node.js (Express + TypeScript), and MongoDB.

## 🏗️ Project Structure

```
pulse_assessment/
├── backend/
│   ├── src/
│   │   ├── config/           # Database and app configuration
│   │   ├── middlewares/      # Auth, RBAC, validation, error handling
│   │   ├── models/          # MongoDB schemas (User, Role, Video, Organization)
│   │   ├── modules/         # Feature modules (auth, video, organization)
│   │   ├── services/        # Business logic (sensitivity, video processing)
│   │   ├── utils/           # JWT utilities
│   │   └── server.ts        # Express server
│   ├── uploads/             # Local file storage
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # VideoPlayer, VideoUpload, ProtectedRoute
    │   ├── context/         # Auth context
    │   ├── pages/           # Login, Signup, Dashboard, Videos
    │   ├── services/        # API services
    │   └── main.tsx
    └── package.json
```

## ✨ Features

### Backend

- **JWT Authentication**: Access & refresh tokens with secure HTTP-only cookies
- **RBAC System**: Roles (admin, user, moderator, editor) with granular permissions
- **Video Upload**: Multer integration with file validation (MP4, AVI, MOV, MKV)
- **Sensitivity Analysis**: Content moderation with sensitivity scoring and flags
- **Video Processing**: Async processing pipeline with status tracking
- **Video Streaming**: HLS streaming support for processed videos
- **Multi-Tenant Architecture**: Organization-based isolation with member management
- **Moderation System**: Approve/reject/flag videos based on sensitivity analysis
- **MongoDB Integration**: Mongoose schemas with indexing for performance
- **TypeScript**: Full type safety across the application

### Frontend

- **React 18** with TypeScript
- **Vite**: Fast builds and hot module replacement
- **Tailwind CSS**: Modern, responsive UI
- **Video Player**: Custom player with sensitivity badges and moderation status
- **Upload Interface**: Drag-and-drop with progress tracking
- **Real-time Status**: Processing status updates and streaming availability
- **Protected Routes**: Authentication-based route guards
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local instance)
- npm or yarn

### Backend Setup

1. Navigate to backend:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` from example:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/video_processing
   JWT_SECRET=your_secure_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   JWT_EXPIRE=24h
   JWT_REFRESH_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

5. Seed roles:

   ```bash
   npm run seed:roles
   ```

6. Create admin user (optional):

   ```bash
   npm run create:admin
   ```

7. Start server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`

## 📚 API Documentation

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
POST /api/auth/logout
POST /api/auth/refresh-token
```

### Video Management

```http
POST   /api/videos                 # Upload video (multipart/form-data)
GET    /api/videos                 # List all videos (paginated)
GET    /api/videos/my-videos       # List user's videos
GET    /api/videos/:id             # Get video details
GET    /api/videos/:id/stream      # Get stream URL
PUT    /api/videos/:id             # Update video
PUT    /api/videos/:id/moderate    # Moderate video (admin)
DELETE /api/videos/:id             # Delete video
```

### Organization Management

```http
POST   /api/organizations                      # Create organization
GET    /api/organizations                      # List user's organizations
GET    /api/organizations/:id                  # Get organization details
POST   /api/organizations/:id/members          # Add member
DELETE /api/organizations/:id/members/:userId  # Remove member
```

## 🎯 Key Features Explained

### Sensitivity Analysis

Videos are automatically analyzed for sensitive content:

- **Sensitivity Score**: 0-100 scale
- **Content Flags**: violence, adult, offensive, sensitive
- **Moderation Status**: pending, approved, rejected, flagged
- Scores < 30: Auto-approved
- Scores 30-70: Flagged for review
- Scores > 70: Auto-rejected

### Video Processing Pipeline

1. **Upload**: Video uploaded via multipart form
2. **Processing**: Async processing starts
   - Sensitivity analysis
   - Transcoding to HLS
   - Thumbnail generation
3. **Streaming**: HLS stream available after processing

### Multi-Tenant Architecture

Organizations provide:

- Isolated video storage
- Member management with roles
- Custom settings (storage limits, formats)
- Subscription-based features

## 🧪 Testing

### Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test Video Upload

```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@/path/to/video.mp4" \
  -F "title=Test Video" \
  -F "description=Test description" \
  -F "tags=test,demo"
```

## 🏗️ Architecture Decisions

### Backend

- **Modular Structure**: Each feature in separate module
- **Service Layer**: Business logic separated from controllers
- **Async Processing**: Videos processed in background
- **Local Storage**: All data stored locally (MongoDB + filesystem)

### Frontend

- **Component-Based**: Reusable components
- **Context API**: Global auth state
- **Service Layer**: API calls abstracted
- **Real-time Updates**: Status polling for processing videos

## 📦 Production Deployment

### Environment Variables

Backend `.env`:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/video_processing
JWT_SECRET=strong_production_secret
JWT_REFRESH_SECRET=strong_refresh_secret
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://yourdomain.com
```

### Build Commands

Backend:

```bash
npm run build
npm start
```

Frontend:

```bash
npm run build
# Serve dist folder with nginx or similar
```

## 🔒 Security Features

- JWT tokens with HTTP-only cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- File type validation
- Size limits on uploads
- Role-based access control

## 📝 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

#### Upload Video

```http
POST /api/videos
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- video: [video file]
- title: "Video Title"
- description: "Video Description"
- tags: "tag1,tag2,tag3"
```

#### Get All Videos

```http
GET /api/videos?page=1&limit=10
Authorization: Bearer <access_token>
```

#### Get My Videos

```http
GET /api/videos/my-videos?page=1&limit=10
Authorization: Bearer <access_token>
```

#### Get Video by ID

```http
GET /api/videos/:id
Authorization: Bearer <access_token>
```

#### Update Video

```http
PUT /api/videos/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "tags": "new,tags",
  "status": "completed"
}
```

#### Delete Video

```http
DELETE /api/videos/:id
Authorization: Bearer <access_token>
```

## 🔐 RBAC System

### Roles

- **admin**: Full access to all resources
- **user**: Default role with basic permissions
- **moderator**: Can manage content
- **editor**: Can edit content

### Permissions

- `video:create` - Create videos
- `video:read` - View videos
- `video:update` - Update videos
- `video:delete` - Delete videos
- `user:read` - View user information
- `user:update` - Update user information
- `user:delete` - Delete users
- `role:manage` - Manage roles and permissions

### Default User Role

When a user registers, they are automatically assigned the "user" role with the following permissions:

- `video:create`
- `video:read`
- `video:update`
- `user:read`

## 🛠️ Development

### Backend Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production server
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📦 Dependencies

### Backend

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT implementation
- **bcryptjs**: Password hashing
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **multer**: File upload handling
- **express-validator**: Request validation

### Frontend

- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **jwt-decode**: JWT decoding

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Token refresh mechanism
- Protected API routes
- CORS configuration
- Input validation
- Error handling middleware
- SQL injection prevention (via Mongoose)

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

None at the moment. Please report any issues you encounter.

## 📧 Support

For support, please open an issue in the repository.

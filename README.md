# Video Processing Application

A full-stack video processing application built with React (Vite) for the frontend and Node.js (Express + TypeScript) for the backend. Features include JWT-based authentication, Role-Based Access Control (RBAC), and MongoDB integration.

## 🏗️ Project Structure

```
pulse_assessment/
├── backend/              # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── middlewares/ # Auth, RBAC, error handling
│   │   ├── models/      # MongoDB schemas (User, Role, Video)
│   │   ├── modules/     # Feature modules (auth, video)
│   │   ├── utils/       # Utility functions (JWT)
│   │   └── server.ts    # Main server file
│   ├── uploads/         # File uploads directory
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/            # React + Vite + TypeScript frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React Context (Auth)
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## ✨ Features

### Backend

- **Modular Architecture**: Clean separation of concerns with modules for auth and video processing
- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **RBAC System**: Role-Based Access Control with permissions (admin, user, moderator, editor)
- **MongoDB Integration**: Mongoose schemas for User, Role, and Video
- **TypeScript**: Full type safety across the backend
- **Middleware**: Authentication, authorization, validation, and error handling
- **File Upload**: Multer integration for video file uploads

### Frontend

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Auth Context**: Global authentication state management
- **Protected Routes**: Route guards for authenticated pages
- **Responsive Design**: Mobile-first responsive UI

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:

   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/video_processing
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_refresh_token_secret_here
   JWT_EXPIRE=24h
   JWT_REFRESH_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

#### Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### Video Endpoints

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

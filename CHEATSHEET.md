# Developer Cheat Sheet

## Quick Commands

### Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Seed database with roles
npm run seed:roles

# Create admin user
npm run create:admin

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoints Quick Reference

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (authenticated)
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile (authenticated)

### Videos

- `POST /api/videos` - Upload video (authenticated)
- `GET /api/videos` - Get all videos (authenticated)
- `GET /api/videos/my-videos` - Get user's videos (authenticated)
- `GET /api/videos/:id` - Get video by ID (authenticated)
- `PUT /api/videos/:id` - Update video (authenticated)
- `DELETE /api/videos/:id` - Delete video (authenticated)

## Default Credentials

### Admin User

```
Email: admin@example.com
Password: admin123
```

_Note: Only available after running `npm run create:admin`_

## Environment Variables

### Backend (.env)

```env
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

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Commands

```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Check MongoDB status
brew services list | grep mongodb

# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use video processing database
use video_processing

# Show collections
show collections

# Find all users
db.users.find()

# Find all roles
db.roles.find()

# Drop database (caution!)
db.dropDatabase()
```

## cURL Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Upload Video

```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "video=@/path/to/video.mp4" \
  -F "title=My Video" \
  -F "description=Video description" \
  -F "tags=tag1,tag2"
```

## RBAC Quick Reference

### Default Roles

| Role      | Permissions                                                     |
| --------- | --------------------------------------------------------------- |
| admin     | All permissions                                                 |
| user      | video:create, video:read, video:update, user:read               |
| moderator | video:create, video:read, video:update, video:delete, user:read |
| editor    | video:create, video:read, video:update, user:read               |

### Permission Format

`resource:action`

Examples:

- `video:create`
- `video:read`
- `video:update`
- `video:delete`
- `user:read`
- `user:update`
- `user:delete`
- `role:manage`

## Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port 5000
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:5000)
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
pgrep mongod

# Check MongoDB logs (macOS)
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Clear Node Modules

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Reset Database

```bash
# Drop collections in MongoDB shell
mongosh
use video_processing
db.dropDatabase()

# Then re-seed
npm run seed:roles
```

## Project Structure Quick View

```
pulse_assessment/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── middlewares/   # Middleware
│   │   ├── models/        # Mongoose models
│   │   ├── modules/       # Feature modules
│   │   ├── utils/         # Utilities
│   │   ├── scripts/       # DB scripts
│   │   └── server.ts      # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Components
    │   ├── context/       # Context
    │   ├── pages/         # Pages
    │   ├── services/      # API services
    │   └── App.tsx        # Main app
    └── package.json
```

## Git Commands

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create .gitignore
echo "node_modules
.env
.DS_Store
dist
uploads
*.log" > .gitignore

# Push to remote
git remote add origin <your-repo-url>
git push -u origin main
```

## Testing with Postman

1. Import collection with these endpoints
2. Set environment variable `baseUrl` = `http://localhost:5000/api`
3. After login, save `accessToken` to environment
4. Use `{{baseUrl}}` and `{{accessToken}}` in requests

## VS Code Extensions (Recommended)

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- REST Client
- GitLens

## Keyboard Shortcuts

### VS Code

- `Cmd/Ctrl + P` - Quick file search
- `Cmd/Ctrl + Shift + P` - Command palette
- `Cmd/Ctrl + B` - Toggle sidebar
- `Cmd/Ctrl + ~` - Toggle terminal

## Package Management

```bash
# Add new dependency
npm install <package-name>

# Add dev dependency
npm install -D <package-name>

# Update packages
npm update

# Check outdated packages
npm outdated

# Audit security
npm audit

# Fix security issues
npm audit fix
```

## TypeScript Commands

```bash
# Check types without compiling
tsc --noEmit

# Watch mode
tsc --watch

# Clean build
rm -rf dist && npm run build
```

## Useful VS Code Snippets

### React Component

```typescript
import React from "react";

interface Props {}

const ComponentName: React.FC<Props> = () => {
  return <div></div>;
};

export default ComponentName;
```

### Express Route Handler

```typescript
export const handlerName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Logic here
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
```

## Debugging

### Backend

```bash
# Start with Node debugger
node --inspect src/server.ts

# Use VS Code debugger
# Add to .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/backend/src/server.ts",
  "preLaunchTask": "tsc: build - backend/tsconfig.json",
  "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
}
```

### Frontend

Use React DevTools browser extension

## Production Checklist

- [ ] Change JWT secrets to strong random values
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB instance
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Add rate limiting
- [ ] Enable compression
- [ ] Set up logging
- [ ] Configure file upload limits
- [ ] Add monitoring
- [ ] Set up backups
- [ ] Remove console.logs
- [ ] Minify frontend build
- [ ] Add CSP headers
- [ ] Enable helmet for security headers

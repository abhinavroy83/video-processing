# Quick Start Guide

This guide will help you set up and run the Video Processing Application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

## Installation

### 1. Clone or Download the Repository

If you haven't already, navigate to the project directory:

```bash
cd pulse_assessment
```

### 2. Backend Setup

#### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

#### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred text editor and update the following:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/video_processing
JWT_SECRET=your_secure_jwt_secret_change_this
JWT_REFRESH_SECRET=your_secure_refresh_secret_change_this
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads
```

**Important**: Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to random, secure strings in production!

#### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**macOS (with Homebrew):**

```bash
brew services start mongodb-community
```

**Linux:**

```bash
sudo systemctl start mongod
```

**Windows:**
Start MongoDB from Services or run:

```bash
mongod
```

#### Step 4: Seed Database with Default Roles

```bash
npm run seed:roles
```

This will create the following roles:

- **admin**: Full access
- **user**: Default role (assigned to new registrations)
- **moderator**: Content moderation
- **editor**: Content editing

#### Step 5: Start Backend Server

```bash
npm run dev
```

The backend should now be running at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window/tab and navigate to the frontend directory:

#### Step 1: Install Frontend Dependencies

```bash
cd frontend  # or cd ../frontend if you're in the backend directory
npm install
```

#### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 3: Start Frontend Server

```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173`

## Testing the Application

### 1. Create an Account

1. Open your browser and go to `http://localhost:5173`
2. You'll be redirected to the login page
3. Click on "create a new account"
4. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
5. Click "Sign up"

### 2. Explore the Dashboard

After registration, you'll be automatically logged in and redirected to the dashboard where you can:

- View your profile information
- See your role and permissions
- Upload videos (feature ready for implementation)
- View your uploaded videos

### 3. Test Authentication

1. Click "Logout" in the dashboard
2. Try to access `http://localhost:5173/dashboard` - you should be redirected to login
3. Log back in with your credentials

## API Testing with cURL

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
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

Save the `accessToken` from the response for authenticated requests.

### Get Profile (Authenticated)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Videos (Authenticated)

```bash
curl -X GET http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Backend won't start

**Error: MongoDB connection failed**

- Ensure MongoDB is running: `mongod --version` and `mongo --eval "db.runCommand({ ping: 1 })"`
- Check if MongoDB is running on the correct port (default: 27017)
- Verify `MONGODB_URI` in `.env` file

**Error: Port 5000 already in use**

- Change `PORT` in backend `.env` file to another port (e.g., 5001)
- Update `VITE_API_URL` in frontend `.env` to match

### Frontend won't start

**Error: Port 5173 already in use**

- Kill the process using port 5173 or Vite will automatically use another port
- Update `CLIENT_URL` in backend `.env` if port changes

**Error: Cannot connect to API**

- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env` matches backend URL
- Check browser console for CORS errors

### Database Issues

**Roles not created**

- Run `npm run seed:roles` in the backend directory
- Check MongoDB connection

**User registration fails**

- Ensure roles are seeded in the database
- Check backend console for error messages

## Production Deployment

### Backend

1. Build the TypeScript code:

   ```bash
   npm run build
   ```

2. Set `NODE_ENV=production` in `.env`

3. Use strong, unique secrets for JWT tokens

4. Use a production MongoDB instance (MongoDB Atlas recommended)

5. Start with:
   ```bash
   npm start
   ```

### Frontend

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. The `dist` folder contains the static files ready for deployment

3. Deploy to Vercel, Netlify, or any static hosting service

4. Update `VITE_API_URL` to your production API URL

## Next Steps

- Implement video upload functionality
- Add video processing features
- Implement video streaming
- Add user management for admins
- Implement email verification
- Add password reset functionality
- Implement video analytics

## Support

If you encounter any issues:

1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB is running and accessible

For additional help, please refer to the main README.md file.

# Video Processing Frontend

React + Vite + TypeScript frontend with Tailwind CSS.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your API URL

4. Run development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/      # Reusable components
│   └── ProtectedRoute.tsx  # Route guard
├── context/         # React Context
│   └── AuthContext.tsx     # Authentication context
├── pages/          # Page components
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── Dashboard.tsx
├── services/       # API services
│   ├── api.ts              # Axios instance
│   └── authService.ts      # Authentication service
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Features

- JWT-based authentication
- Protected routes
- Responsive design with Tailwind CSS
- Token refresh mechanism
- Form validation
- Error handling

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

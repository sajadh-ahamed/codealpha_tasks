# NextGen Social Media Platform

A cutting-edge, production-ready full-stack web application built meticulously with React (Vite), Express.js, MongoDB, Tailwind CSS, and Framer Motion. Features a dynamic infinite-feed, real-time messaging, interactive stories, and glassmorphic UI elements crafted to WOW users from the first glance.

## Features

- **Responsive Modern Design**: Mobile-first glassmorphism layout with native-feeling animations and transitions using Framer Motion.
- **Real-Time Data**: Socket.io integrated for instant messaging and live notifications.
- **Authentic Social Feeds**: Interactive post cards with explosive heart animations, comments, and media support.
- **Fast and Scalable Architecture**: Node.js RESTful APIs coupled with Zustand for snappy global state management.
- **Secure Handling**: JWT cookies, bcrypt hashed credentials, and comprehensive database schema relationships (User, Post, Comment, Notification, Story).

## Getting Started

### Prerequisites
- Node.js (v18+)
- Local or Atlas MongoDB URI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install standard dependencies:
   ```bash
   npm install
   ```
3. Set environment variables in `Backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nextgen_social
   JWT_SECRET=YOUR_SUPER_SECRET
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```

🚀 The platform is now up and running! Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack Deep Dive
- **Frontend Stack**: React 18, Vite, TailwindCSS (Arbitrary values & utilities), Framer Motion, Zustand, Lucide React Icons.
- **Backend Stack**: Express.js, Mongoose ODM, Socket.io, JWT Authentication.

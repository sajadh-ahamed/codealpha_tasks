# Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation Steps

1. **Navigate to the Back-end directory:**
   ```bash
   cd Back-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
   ```
   - Edit `.env` and update the following:
     - `MONGODB_URI`: Your MongoDB connection string
       - Local: `mongodb://localhost:27017/watches-ecommerce`
       - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/watches-ecommerce`
     - `JWT_SECRET`: A random secret string for JWT tokens (change this!)
     - `PORT`: Server port (default: 5000)

4. **Start MongoDB:**
   - If using local MongoDB, make sure MongoDB service is running
   - If using MongoDB Atlas, ensure your connection string is correct

5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```
   This will populate the database with sample watch data.

6. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

7. **Verify the server is running:**
   - Open your browser and go to: `http://localhost:5000/api/health`
   - You should see: `{"status":"OK","message":"Server is running"}`

## Frontend Configuration

To connect the frontend to the backend:

1. **Create a `.env` file in the frontend root directory:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Restart the frontend development server** after adding the environment variable.

## Default Admin Account

When registering a user with the email `admin@admin.com`, they will automatically be assigned the admin role.

Alternatively, you can manually set a user as admin in MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Watches
- `GET /api/watches` - Get all watches (supports query params: category, search, sort, page, limit)
- `GET /api/watches/:id` - Get watch by ID
- `POST /api/watches` - Create watch (admin only)
- `PUT /api/watches/:id` - Update watch (admin only)
- `DELETE /api/watches/:id` - Delete watch (admin only)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local installation)
- Check your connection string in `.env`
- Verify network connectivity (if using MongoDB Atlas)

### CORS Errors
- The backend is configured to allow CORS from all origins in development
- For production, update the CORS configuration in `server.js`

### Authentication Issues
- Ensure JWT_SECRET is set in `.env`
- Check that the Authorization header is included: `Bearer <token>`
- Verify token hasn't expired

### Port Already in Use
- Change the PORT in `.env` to a different port
- Or stop the process using port 5000

## Project Structure

```
Back-end/
├── config/          # Configuration files
│   └── database.js  # MongoDB connection
├── controllers/     # Route controllers
│   ├── authController.js
│   └── watchController.js
├── middleware/      # Custom middleware
│   └── auth.js      # Authentication & authorization
├── models/          # Mongoose models
│   ├── User.js
│   └── Watch.js
├── routes/          # API routes
│   ├── authRoutes.js
│   └── watchRoutes.js
├── scripts/         # Utility scripts
│   └── seedDatabase.js
├── server.js        # Entry point
├── package.json     # Dependencies
└── .env            # Environment variables (create this)
```

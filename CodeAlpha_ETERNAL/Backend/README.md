# Watches E-commerce Backend API

Backend API for the Watches E-commerce application built with Express.js and MongoDB following MVC architecture.

**Full application documentation (frontend + backend + MongoDB + admin):** see [APPLICATION_DOCUMENTATION.md](../APPLICATION_DOCUMENTATION.md) in the project root.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Watch Management**: CRUD operations for watches (admin only for create/update/delete)
- **Search & Filter**: Search watches by name, description, brand, category
- **Sorting**: Sort by price, date, popularity
- **MVC Architecture**: Clean separation of concerns

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/watches-ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires authentication)

### Watches

- `GET /api/watches` - Get all watches
  - Query params: `category`, `search`, `sort`, `page`, `limit`
  - Example: `/api/watches?category=Men&search=Rolex&sort=price-low`

- `GET /api/watches/:id` - Get watch by ID

- `POST /api/watches` - Create watch (Admin only)
  - Requires authentication token in header: `Authorization: Bearer <token>`

- `PUT /api/watches/:id` - Update watch (Admin only)

- `DELETE /api/watches/:id` - Delete watch (Admin only)

## Authentication

To access protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Default Admin Account

When registering with `admin@admin.com`, the user will automatically be assigned the admin role.

## Project Structure

```
Back-end/
├── config/          # Configuration files
├── controllers/     # Route controllers (business logic)
├── middleware/      # Custom middleware (auth, error handling)
├── models/          # Mongoose models
├── routes/          # API routes
├── scripts/         # Utility scripts (seed data, etc.)
├── server.js        # Entry point
└── package.json     # Dependencies
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time

## License

ISC

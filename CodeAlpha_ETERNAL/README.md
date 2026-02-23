# ETERNAL - Full Stack Watch E-Commerce Application

## Project Description
ETERNAL is a comprehensive full-stack e-commerce platform specializing in luxury watches. It provides a complete shopping experience with user authentication, product browsing, cart management, and admin capabilities.

---

## Project Architecture

### Frontend (React + Vite)
A modern, responsive single-page application built with React and Vite for fast development and optimized production builds.

**Key Components:**
- **Navbar.jsx** - Navigation bar with links and user menu
- **Footer.jsx** - Footer with company information
- **ProductCard.jsx** - Reusable component for displaying individual watches
- **ImageCarousel.jsx** - Image slider for product details
- **Toast.jsx** - Notification system for user feedback

**Context System (State Management):**
- **AuthContext** - Manages user authentication and login state
- **CartContext** - Manages shopping cart items and operations
- **ThemeContext** - Manages dark/light theme preferences

**Pages:**
- **HomePage** - Landing page with featured products
- **ProductDetails** - Detailed view of individual watch
- **Cart** - Shopping cart display
- **Checkout** - Payment and order processing
- **Auth** - Login/Register gateway
- **Login** - User login page
- **Register** - New user registration
- **AdminPanel** - Admin dashboard for watch management
- **Success** - Order confirmation page

**Assets:**
- Organized watch images by brand (Rolex, Omega, Hublot, Patek Philippe, etc.)
- Separated by gender (men/women)
- Multiple watch models per brand

### Backend (Node.js + Express)
A RESTful API server handling business logic, database operations, and authentication.

**Controllers:**
- **authController.js** - User registration, login, and session management
- **watchController.js** - Watch CRUD operations and product browsing

**Models:**
- **User.js** - User schema with authentication fields
- **Watch.js** - Watch product schema with details and pricing

**Middleware:**
- **auth.js** - JWT/session authentication middleware for protected routes

**Routes:**
- **authRoutes.js** - Authentication endpoints (login, register, logout)
- **watchRoutes.js** - Product endpoints (list, search, details)

**Database:**
- **config/database.js** - Database connection configuration
- **scripts/seedDatabase.js** - Initial data population

---

## Technology Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **State Management:** Context API
- **Styling:** CSS (component-scoped)
- **API Communication:** Axios/Fetch

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (implied from seed scripts)
- **Authentication:** JWT or Session-based
- **API Style:** RESTful

---

## File Structure Overview

```
Frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # Global state management
│   ├── pages/           # Page components for routing
│   ├── utils/           # Helper functions and API calls
│   ├── styles/          # Global styles
│   └── App.jsx          # Root component
├── public/
│   └── assets/          # Static images and media
└── package.json

Backend/
├── controllers/         # Business logic handlers
├── models/             # Database schemas
├── routes/             # API endpoint definitions
├── middleware/         # Authentication & validation
├── config/             # Database and app configuration
├── scripts/            # Database seeding utilities
└── server.js           # Express app entry point
```

---

## Key Features

### User Features
✅ User registration and authentication
✅ Browse luxury watch catalog
✅ View detailed product information
✅ Add items to shopping cart
✅ Checkout and order placement
✅ Theme customization (dark/light mode)

### Admin Features
✅ Access admin panel
✅ Manage watch inventory
✅ Add/edit/delete products
✅ View order information

---

## Getting Started

### Backend Setup
```bash
cd Backend
npm install
npm start
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

For detailed setup instructions, refer to:
- [Frontend README](Frontend/README.md)
- [Backend README](Backend/README.md)
- [Backend Setup Guide](Backend/SETUP.md)

---

## Database Seeding
The project includes seed scripts to populate initial watch data:
- `Backend/scripts/seedDatabase.js` - Original seed script
- `Backend/scripts/seedDatabase_new.js` - Updated seed script

---

## API Endpoints (Typical)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/watches` - Get all watches
- `GET /api/watches/:id` - Get watch details
- `GET /api/watches/search?query=` - Search watches by brand/model

### Admin (Protected)
- `POST /api/watches` - Add new watch
- `PUT /api/watches/:id` - Update watch
- `DELETE /api/watches/:id` - Delete watch

---

## Development Workflow

1. **Frontend Development** - Modify components in `src/components` and pages in `src/pages`
2. **Backend Development** - Update controllers, models, and routes in respective folders
3. **Styling** - Each component has its own CSS file for scoped styling
4. **State Management** - Use context providers for global state (auth, cart, theme)
5. **API Integration** - Use utilities in `src/utils/api.js` for server communication

---

## Notes
- The application supports luxury watch brands: Rolex, Omega, Hublot, Patek Philippe, Audemars Piguet, Cartier, Richard Mille
- Watch images are organized hierarchically by brand and gender
- The project uses modern React patterns with Context API for state management
- Authentication is likely JWT-based with protected routes using middleware

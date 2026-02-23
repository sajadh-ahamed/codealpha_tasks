# ETERNAL - Premium Timepieces E-Commerce Store

A full stack **MERN** (MongoDB, Express, React, Node.js) e-commerce application for **ETERNAL** watch store.

**Website built by Sajadh Ahamed**  
Contact: rafausajadh@gmail.com | 0789143352

## Full Stack Overview

- **Frontend:** React (Vite), React Router, Context API
- **Backend:** Express.js, MVC architecture (`Back-end/` folder)
- **Database:** MongoDB (users + watches); no manual DB creation needed

- **Detailed app doc:** [APPLICATION_DOCUMENTATION.md](./APPLICATION_DOCUMENTATION.md) (completeness, DB, admin, API).
- **MongoDB setup (step-by-step):** [MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md) (Atlas cloud or local install).

## Features

- 🏠 **Homepage** with product grid, filters, search, and sorting
- 📱 **Product Details** with image carousel and reviews
- 🛒 **Shopping Cart** with smooth animations
- 🔐 **Authentication** (Login/Register) with form validation
- 👨‍💼 **Admin Panel** for managing products
- 🌓 **Dark/Light Mode** toggle
- 📱 **Fully Responsive** design
- ✨ **Smooth Animations** and transitions
- 🚀 **Performance Optimized** with lazy loading

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── context/       # React Context providers
├── utils/         # Utility functions
├── assets/        # Images and static files
└── styles/        # Global styles
```

## Technologies

- React 18
- React Router DOM
- Vite
- CSS Modules
- React Icons

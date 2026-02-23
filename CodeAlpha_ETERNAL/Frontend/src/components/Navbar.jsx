import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FiSearch, FiShoppingCart, FiUser, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import './Navbar.css'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getCartCount } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/assets/logo/logo.png" alt="ETERNAL" className="navbar-logo-img" />
          <span className="logo-text eternal-brand">ETERNAL</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search watches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FiSearch />
          </button>
        </form>

        {/* Right Side Icons */}
        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          <Link to="/cart" className="cart-icon" aria-label="Shopping cart">
            <FiShoppingCart />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-icon" aria-label="User menu">
                <FiUser />
              </button>
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                {isAdmin() && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>
          {!user && (
            <div className="mobile-auth">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
          {user && (
            <div className="mobile-user">
              <p>{user.name}</p>
              {isAdmin() && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getWatches } from '../utils/api'
import { categories, sortOptions, watches as mockWatches } from '../utils/mockData'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'
import './HomePage.css'

const HomePage = () => {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    loadWatches()
    // Check URL params for search and category
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [searchParams])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBrandDropdown && !event.target.closest('.brand-dropdown')) {
        setShowBrandDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showBrandDropdown])

  const loadWatches = async () => {
    setLoading(true)
    try {
      const data = await getWatches({ limit: 1000 })
      const finalData = Array.isArray(data) && data.length > 0 ? data : mockWatches
      
      setWatches(finalData)
      
      // Reset selected brand if it doesn't exist in the new data
      const availableBrands = [
        'All',
        ...Array.from(
          new Set(
            finalData
              .map(w => (w.brand || '').trim())
              .filter(Boolean)
              .map(brand => brand.toLowerCase())
          )
        )
      ]
      if (selectedBrand !== 'All' && !availableBrands.includes(selectedBrand.toLowerCase())) {
        setSelectedBrand('All')
      }
    } catch (error) {
      console.error('Error loading watches from API:', error)
      setWatches(mockWatches)
      
      // Reset selected brand if it doesn't exist in mock data
      const mockBrands = [
        'All',
        ...Array.from(
          new Set(
            mockWatches
              .map(w => (w.brand || '').trim())
              .filter(Boolean)
              .map(brand => brand.toLowerCase())
          )
        )
      ]
      if (selectedBrand !== 'All' && !mockBrands.includes(selectedBrand.toLowerCase())) {
        setSelectedBrand('All')
      }
    } finally {
      setLoading(false)
    }
  }

  // Available brands (from current data or mock fallback)
  const brands = useMemo(() => {
    const source = watches.length ? watches : mockWatches
    const uniqueBrands = Array.from(
      new Set(
        source
          .map(w => (w.brand || '').trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b))
    return ['All', ...uniqueBrands]
  }, [watches])

  // Filter and sort watches
  const filteredAndSortedWatches = useMemo(() => {
    let filtered = [...watches]

    // Filter by category (Men / Women / All)
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(watch => watch.category === selectedCategory)
    }

    // Filter by brand
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(watch => 
        watch.brand && watch.brand.trim().toLowerCase() === selectedBrand.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(watch =>
        watch.name.toLowerCase().includes(query) ||
        watch.description.toLowerCase().includes(query) ||
        watch.category.toLowerCase().includes(query)
      )
    }

    // Sort watches
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        break
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    return filtered
  }, [watches, selectedCategory, selectedBrand, sortBy, searchQuery])

  return (
    <div className="homepage">
      {/* Hero Section with Background Video */}
      <section className="hero-section">
        <video 
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/assets/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">ETERNAL</h1>
          <p className="hero-subtitle">Timeless Elegance, Eternal Precision</p>
          <p className="hero-tagline">Discover our exquisite collection of premium timepieces</p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filters-left">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="brand-filters">
              <div className="brand-dropdown">
                <button
                  className={`brand-dropdown-toggle ${selectedBrand !== 'All' ? 'active' : ''}`}
                  onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                >
                  By Brands {selectedBrand !== 'All' ? `(${selectedBrand})` : ''}
                  <span className={`dropdown-arrow ${showBrandDropdown ? 'open' : ''}`}>▼</span>
                </button>
                {showBrandDropdown && (
                  <div className="brand-dropdown-menu">
                    <button
                      className={`brand-option ${selectedBrand === 'All' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedBrand('All')
                        setShowBrandDropdown(false)
                      }}
                    >
                      All Brands
                    </button>
                    {brands.slice(1).map(brand => (
                      <button
                        key={brand}
                        className={`brand-option ${selectedBrand === brand ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedBrand(brand)
                          setShowBrandDropdown(false)
                        }}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="filters-right">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading watches...</p>
            </div>
          ) : filteredAndSortedWatches.length === 0 ? (
            <div className="empty-state">
              <p>No watches found matching your criteria.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSelectedBrand('All')
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="results-count">
                Showing {filteredAndSortedWatches.length} watch{filteredAndSortedWatches.length !== 1 ? 'es' : ''}
              </div>
              <div className={`products-grid ${viewMode}`}>
                {filteredAndSortedWatches.map(watch => (
                  <ProductCard key={watch.id} product={watch} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage

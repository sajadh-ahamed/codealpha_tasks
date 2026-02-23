import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getWatches, addWatch, updateWatch, deleteWatch } from '../utils/api'
import { showToast } from '../utils/toast'
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import './AdminPanel.css'

const AdminPanel = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingWatch, setEditingWatch] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Men',
    brand: '',
    price: '',
    originalPrice: '',
    description: '',
    stock: '',
    image: '',
    images: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!isAdmin()) {
      showToast('Access denied. Admin only.', 'error')
      navigate('/')
      return
    }
    loadWatches()
  }, [user, isAdmin, navigate])

  const loadWatches = async () => {
    setLoading(true)
    try {
      const data = await getWatches()
      setWatches(data)
    } catch (error) {
      console.error('Error loading watches:', error)
      showToast('Error loading watches', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (watch = null) => {
    if (watch) {
      setEditingWatch(watch)
      setFormData({
        name: watch.name,
        category: watch.category,
        brand: watch.brand || '',
        price: watch.price.toString(),
        originalPrice: watch.originalPrice?.toString() || '',
        description: watch.description,
        stock: watch.stock.toString(),
        image: watch.image,
        images: watch.images?.join(', ') || watch.image
      })
    } else {
      setEditingWatch(null)
      setFormData({
        name: '',
        category: 'Men',
        brand: '',
        price: '',
        originalPrice: '',
        description: '',
        stock: '',
        image: '',
        images: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingWatch(null)
    setFormData({
      name: '',
      category: 'Men',
      brand: '',
      price: '',
      originalPrice: '',
      description: '',
      stock: '',
      image: '',
      images: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImagePreview = (e) => {
    const url = e.target.value
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const watchData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        description: formData.description,
        stock: parseInt(formData.stock),
        image: formData.image,
        images: formData.images.split(',').map(url => url.trim()).filter(url => url)
      }

      if (editingWatch) {
        await updateWatch(editingWatch.id, watchData)
        showToast('Watch updated successfully!', 'success')
      } else {
        await addWatch(watchData)
        showToast('Watch added successfully!', 'success')
      }
      
      handleCloseModal()
      loadWatches()
    } catch (error) {
      console.error('Error saving watch:', error)
      showToast('Error saving watch', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) {
      return
    }

    try {
      await deleteWatch(id)
      showToast('Watch deleted successfully!', 'success')
      loadWatches()
    } catch (error) {
      console.error('Error deleting watch:', error)
      showToast('Error deleting watch', 'error')
    }
  }

  const filteredWatches = watches.filter(watch =>
    watch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watch.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add New Watch
        </button>
      </div>

      <div className="admin-controls">
        <div className="admin-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search watches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWatches.map(watch => (
              <tr key={watch.id}>
                <td>
                  <img src={watch.image} alt={watch.name} className="admin-thumbnail" loading="lazy" />
                </td>
                <td>{watch.name}</td>
                <td><span className="brand-badge">{watch.brand}</span></td>
                <td><span className="category-badge">{watch.category}</span></td>
                <td>${watch.price.toFixed(2)}</td>
                <td>{watch.stock}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleOpenModal(watch)}
                      aria-label="Edit watch"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(watch.id)}
                      aria-label="Delete watch"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWatch ? 'Edit Watch' : 'Add New Watch'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Watch Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Rolex, Omega, Patek Philippe"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price ($)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Main Image URL *</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={(e) => {
                      handleInputChange(e)
                      handleImagePreview(e)
                    }}
                    required
                    placeholder="https://example.com/watch.jpg or /assets/images/watch.jpg"
                  />
                </div>
              </div>

              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                </div>
              )}

              <div className="form-group">
                <label>Additional Images (comma-separated URLs)</label>
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingWatch ? 'Update Watch' : 'Add Watch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel

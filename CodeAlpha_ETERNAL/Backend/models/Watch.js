const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a watch name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Men', 'Women'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be positive']
  },
  priceAED: {
    type: Number,
    min: [0, 'Price AED must be positive']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price must be positive']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviews: {
    type: Number,
    min: [0, 'Reviews cannot be negative'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Expose id for frontend (frontend expects "id", MongoDB uses "_id")
watchSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Index for search functionality
watchSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Watch', watchSchema);

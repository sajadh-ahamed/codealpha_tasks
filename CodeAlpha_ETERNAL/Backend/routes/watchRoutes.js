const express = require('express');
const router = express.Router();
const {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
} = require('../controllers/watchController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getWatches);
router.get('/:id', getWatchById);

// Protected admin routes
router.post('/', protect, authorize('admin'), createWatch);
router.put('/:id', protect, authorize('admin'), updateWatch);
router.delete('/:id', protect, authorize('admin'), deleteWatch);

module.exports = router;

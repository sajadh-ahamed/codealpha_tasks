const Watch = require('../models/Watch');

// @desc    Get all watches with filtering, sorting, and search
// @route   GET /api/watches
// @access  Public
exports.getWatches = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 100 } = req.query;

    // Build query
    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortBy = {};
    switch (sort) {
      case 'price-low':
        sortBy = { price: 1 };
        break;
      case 'price-high':
        sortBy = { price: -1 };
        break;
      case 'newest':
        sortBy = { dateAdded: -1 };
        break;
      case 'popular':
        sortBy = { reviews: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }

    // Execute query
    const watches = await Watch.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count for pagination
    const total = await Watch.countDocuments(query);

    res.status(200).json({
      success: true,
      count: watches.length,
      total,
      data: watches
    });
  } catch (error) {
    console.error('Get watches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching watches',
      error: error.message
    });
  }
};

// @desc    Get single watch by ID
// @route   GET /api/watches/:id
// @access  Public
exports.getWatchById = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: watch
    });
  } catch (error) {
    console.error('Get watch by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching watch',
      error: error.message
    });
  }
};

// @desc    Create new watch
// @route   POST /api/watches
// @access  Private/Admin
exports.createWatch = async (req, res) => {
  try {
    const watch = await Watch.create(req.body);

    res.status(201).json({
      success: true,
      data: watch
    });
  } catch (error) {
    console.error('Create watch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating watch',
      error: error.message
    });
  }
};

// @desc    Update watch
// @route   PUT /api/watches/:id
// @access  Private/Admin
exports.updateWatch = async (req, res) => {
  try {
    let watch = await Watch.findById(req.params.id);

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found'
      });
    }

    watch = await Watch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: watch
    });
  } catch (error) {
    console.error('Update watch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating watch',
      error: error.message
    });
  }
};

// @desc    Delete watch
// @route   DELETE /api/watches/:id
// @access  Private/Admin
exports.deleteWatch = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found'
      });
    }

    await watch.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Watch deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete watch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting watch',
      error: error.message
    });
  }
};

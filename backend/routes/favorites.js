const express=require("express")
const router=express.Router()
const Favorite=require('../models/Favourites')
const authMidddleware=require("../middleware/auth")
router.use(authMidddleware)
// GET /api/favorites
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      q = '',           
      sortBy = 'createdAt', 
      sortOrder = 'desc',   
      page = 1,       
      limit = 12          
    } = req.query;

  
    const query = { userId };

    // Add search functionality
    if (q.trim()) {
      query.$or = [
        { recipeName: { $regex: q.trim(), $options: 'i' } },
        { $text: { $search: q.trim() } }
      ];
    }

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [favorites, totalCount] = await Promise.all([
      Favorite.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Favorite.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// POST /api/favorites
router.post('/', auth, async (req, res) => {
  try {
    const { recipeId, recipeName, thumbnail } = req.body;
    const userId = req.user.id;

    // Validation
    if (!recipeId || !recipeName || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Recipe ID, name, and thumbnail are required'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, recipeId });
    if (existingFavorite) {
      return res.status(409).json({
        success: false,
        message: 'Recipe already in favorites'
      });
    }

    // Create new favorite
    const favorite = new Favorite({
      userId,
      recipeId,
      recipeName,
      thumbnail
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });

  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Recipe already in favorites'
      });
    }

    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// DELETE /api/favorites/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const favoriteId = req.params.id;

    // Find and delete favorite (ensure it belongs to the user)
    const favorite = await Favorite.findOneAndDelete({
      _id: favoriteId,
      userId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Removed from favorites',
      data: favorite
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

const express=require("express")
const router=express.Router()
const authMidddleware=require("../middleware/auth")
const Favourites = require("../models/Favourites")
router.use(authMidddleware)
// GET /api/favorites
router.get('/', async (req, res) => {
  try {
  const userId=req.user.id
    const favourites=await Favourites.find({userId})
    res.json(favourites)
  } catch (error) {
    res.status(500).json({
      message:"Error while fetching favourites",
      error: error.message
    });
  }
});
// /api/favorites
router.post('/',async (req, res) => {
  try {
    const { idMeal, strMeal, strMealThumb, strCategory, strArea,ingredients,instructions } = req.body;
    const userId = req.user.id;

    // ✅ Validation
    if (!idMeal || !strMeal || !strMealThumb) {
      return res.status(400).json({
        message: 'Meal ID, name, and thumbnail are required'
      });
    }

    // ✅ Check if already favorited
    const existingFavorite = await Favourites.findOne({ userId, idMeal });
    if (existingFavorite) {
      return res.status(409).json({
        message: 'Recipe already in favorites'
      });
    }

    // ✅ Create new favorite
    const favorite = new Favourites({
      userId,
      idMeal,
      strMeal,
      strMealThumb,
      strCategory,
      strArea,
      ingredients,
      instructions
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });

  } catch (error) {
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
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const idMeal = req.params.id;
    const favorite = await Favourites.findOneAndDelete({
      idMeal,
      userId
    });

    if (!favorite) {
      return res.status(404).json({
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
module.exports=router
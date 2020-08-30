const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe,
  fileUpload,
  uploadRecipePhoto,
} = require('../controllers/recipes');

router.route('/').get(getRecipes).post(auth, createRecipe);
router.route('/:id').get(getRecipe).delete(deleteRecipe).put(updateRecipe);
router.route('/photo-upload').post(uploadRecipePhoto, fileUpload);

module.exports = router;

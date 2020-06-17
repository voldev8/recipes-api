var express = require('express');
var router = express.Router();
const {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} = require('../controllers/recipes');

router.route('/').get(getRecipes).post(createRecipe);
router.route('/:id').get(getRecipe).delete(deleteRecipe).put(updateRecipe);

module.exports = router;

const mongoose = require('mongoose');
const slugify = require('slugify');
const { NotExtended } = require('http-errors');

const RecipesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  ingredients: {
    type: [String],
    required: [true, 'Please add an ingredient'],
    maxlength: [500, 'Ingredient can not be more than 50 characters'],
  },
  directions: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  link: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: String,
});

RecipesSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

module.exports = mongoose.model('Recipes', RecipesSchema);

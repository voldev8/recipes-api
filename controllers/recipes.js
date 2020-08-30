const Recipe = require('../models/Recipes');
const asyncHandler = require('../middleware/async');
const multer = require('multer');
var AWS = require('aws-sdk');
const AppError = require('../utils/appError');

// Get recipes
exports.getRecipes = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find();

  if (!recipes) res.json({ success: false });
  res.status(200).json(recipes);
});

// Get one recipe
exports.getRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) return res.status(400).json({ success: false });
  res.status(200).json({ success: true, data: recipe });
});

// Create a recipe
exports.createRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.create(req.body);
  console.log(req.body);

  if (!recipe) return res.status(400).json({ success: false });
  res.status(200).json({ success: true, data: recipe });
});

// Update a recipe
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!recipe) return res.status(400).json({ success: false });
  res.status(200).json({ success: true, data: recipe });
});

// Delete a recipe
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  const deleted_name = recipe.name;

  if (!recipe) return res.status(400).json({ success: false });
  res.status(200).json({ success: true, data: `${deleted_name} deleted.` });
});

// Upload photo

// Multer configuration
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRecipePhoto = upload.single('file');

// route to upload a pdf document file
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
exports.fileUpload = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  //Where you want to store your file
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  s3bucket.upload(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      res.send({ data });
      var newFileUploaded = {
        description: req.body.description,
        fileLink: s3FileURL + file.name,
        s3_key: params.Key,
      };
    }
  });
});

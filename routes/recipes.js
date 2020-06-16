var express = require('express');
var router = express.Router();

/* GET recipes listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
/* GET one recipe listing. */
router.get('/:id', function (req, res, next) {
  res.send(`get recipe id ${req.params.id}`);
});
/* POST recipe listing. */
router.post('/', function (req, res, next) {
  res.send('posting');
});
/* DELETE recipe listing. */
router.delete('/:id', function (req, res, next) {
  res.send(`delete recipe id ${req.params.id}`);
});
/* UPDATE recipes listing. */
router.put('/:id', function (req, res, next) {
  res.send(`update recipe id ${req.params.id}`);
});

module.exports = router;

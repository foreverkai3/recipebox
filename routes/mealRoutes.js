// routes/mealRoutes.js
// Route definitions: which URL is handled by which controller function.

const express = require('express');
const controller = require('../controllers/mealController');
const validateSearch = require('../middleware/validateSearch');

const router = express.Router();

router.get('/', controller.showHome);                         // home page
router.post('/search', validateSearch, controller.search);    // form input -> API request
router.get('/search', (req, res) => res.redirect('/'));       // opening /search directly goes home
router.get('/categories', controller.showCategories);         // all categories
router.get('/category/:name', controller.showCategory);       // meals in a category
router.get('/cuisines', controller.showCuisines);             // all cuisines
router.get('/cuisine/:area', controller.showCuisine);         // meals of a cuisine
router.get('/meal/:id', controller.showMeal);                 // recipe details page
router.get('/random', controller.showRandom);                 // random recipe

module.exports = router;

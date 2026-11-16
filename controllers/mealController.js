// controllers/mealController.js
// Request handling logic: get data from the service, process it, render a view.
// Every function is async and uses try/catch. Errors go to the central
// error handler with next(err), so the server never crashes.

const mealService = require('../services/mealService');
const helpers = require('../utils/mealHelpers');

// Allowed values in the URL, checked before calling the API
const ID_PATTERN = /^\d+$/;              // meal id: only digits
const NAME_PATTERN = /^[\p{L}\s'-]{2,50}$/u; // category / cuisine name

// GET /  - home page: search form, categories and a random "recipe of the moment"
async function showHome(req, res, next) {
  try {
    // two API requests at the same time
    const [categories, randomMeal] = await Promise.all([
      mealService.getCategories(),
      mealService.getRandomMeal(),
    ]);

    res.render('index', {
      title: 'Home',
      categories,
      featured: randomMeal ? helpers.formatMealCard(randomMeal) : null,
      error: null,
      query: '',
      type: 'name',
    });
  } catch (err) {
    next(err);
  }
}

// POST /search  - the input was already checked by the validateSearch middleware
async function search(req, res, next) {
  try {
    const { query, type } = req.search;
    const sort = req.body.sort === 'desc' ? 'desc' : 'asc';

    // different API request depending on what the user chose
    const meals = type === 'name'
      ? await mealService.searchByName(query)
      : await mealService.filterByIngredient(query.replace(/\s+/g, '_')); // API uses "_" in ingredient names

    const cards = helpers.sortMeals(meals.map(helpers.formatMealCard), sort);

    res.render('results', {
      title: `Results for "${query}"`,
      heading: `Results for "${query}"`,
      subheading: type === 'name' ? 'Search by dish name' : 'Search by main ingredient',
      meals: cards,
      count: cards.length,
      sortLinks: false, // POST results: sorting is chosen in the form
    });
  } catch (err) {
    next(err);
  }
}

// GET /categories  - all categories
async function showCategories(req, res, next) {
  try {
    const categories = await mealService.getCategories();
    const list = categories.map((c) => ({
      name: c.strCategory,
      image: c.strCategoryThumb || helpers.PLACEHOLDER_IMAGE,
      description: helpers.shorten(c.strCategoryDescription, 140),
    }));
    res.render('categories', { title: 'Categories', categories: list });
  } catch (err) {
    next(err);
  }
}

// GET /category/:name  - meals in one category, sorted with ?sort=asc|desc
async function showCategory(req, res, next) {
  try {
    const name = req.params.name;
    if (!NAME_PATTERN.test(name)) return next(); // bad value -> 404 page

    const sort = req.query.sort === 'desc' ? 'desc' : 'asc';
    const meals = await mealService.filterByCategory(name);
    const cards = helpers.sortMeals(meals.map(helpers.formatMealCard), sort);

    res.render('results', {
      title: `${name} recipes`,
      heading: `${name} recipes`,
      subheading: 'Category',
      meals: cards,
      count: cards.length,
      sortLinks: true,
      sort,
      basePath: `/category/${encodeURIComponent(name)}`,
    });
  } catch (err) {
    next(err);
  }
}

// GET /cuisines  - all cuisines (areas), sorted A-Z
async function showCuisines(req, res, next) {
  try {
    const areas = await mealService.getAreas();
    const names = areas
      .map((a) => a.strArea)
      .filter((name) => name && name !== 'Unknown')
      .sort((a, b) => a.localeCompare(b));
    res.render('cuisines', { title: 'Cuisines', cuisines: names });
  } catch (err) {
    next(err);
  }
}

// GET /cuisine/:area  - meals of one cuisine
async function showCuisine(req, res, next) {
  try {
    const area = req.params.area;
    if (!NAME_PATTERN.test(area)) return next(); // bad value -> 404 page

    const sort = req.query.sort === 'desc' ? 'desc' : 'asc';
    const meals = await mealService.filterByArea(area);
    const cards = helpers.sortMeals(meals.map(helpers.formatMealCard), sort);

    res.render('results', {
      title: `${area} cuisine`,
      heading: `${area} cuisine`,
      subheading: 'Cuisine',
      meals: cards,
      count: cards.length,
      sortLinks: true,
      sort,
      basePath: `/cuisine/${encodeURIComponent(area)}`,
    });
  } catch (err) {
    next(err);
  }
}

// GET /meal/:id  - details page of one recipe
async function showMeal(req, res, next) {
  try {
    const id = req.params.id;
    if (!ID_PATTERN.test(id)) return next(); // id is not a number -> 404 page

    const meal = await mealService.getMealById(id);
    if (!meal) return next(); // the API did not find this id -> 404 page

    res.render('meal', { title: meal.strMeal, meal: helpers.formatMealDetails(meal) });
  } catch (err) {
    next(err);
  }
}

// GET /random  - gets a random meal and redirects to its details page
async function showRandom(req, res, next) {
  try {
    const meal = await mealService.getRandomMeal();
    if (!meal) return next();
    res.redirect(`/meal/${meal.idMeal}`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  showHome,
  search,
  showCategories,
  showCategory,
  showCuisines,
  showCuisine,
  showMeal,
  showRandom,
};

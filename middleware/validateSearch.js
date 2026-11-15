// Custom middleware: validates the search form BEFORE we call the API.
// If the input is wrong, we show the home page again with an error message
// and the API is never called.

const mealService = require('../services/mealService');

// letters (any language), spaces, hyphens and apostrophes
const ALLOWED = /^[\p{L}\s'-]+$/u;

async function validateSearch(req, res, next) {
  const query = (req.body.query || '').trim();
  const type = req.body.type;

  let error = null;

  if (!query) {
    error = 'Please enter a dish name or an ingredient.';
  } else if (query.length < 2 || query.length > 50) {
    error = 'The search text must be between 2 and 50 characters.';
  } else if (!ALLOWED.test(query)) {
    error = 'Use only letters, spaces, hyphens (-) and apostrophes (\').';
  } else if (type !== 'name' && type !== 'ingredient') {
    error = 'Please choose what to search by: name or ingredient.';
  }

  if (!error) {
    // input is valid: save the clean values and continue to the controller
    req.search = { query, type };
    return next();
  }

  // input is invalid: render the home page again with the message (status 400)
  try {
    const categories = await mealService.getCategories();
    res.status(400).render('index', {
      title: 'Home',
      categories,
      featured: null,
      error,
      query,
      type,
    });
  } catch (err) {
    next(err); // if even the categories request fails, go to the error handler
  }
}

module.exports = validateSearch;

// utils/mealHelpers.js
// Data processing: we do not show the raw JSON from the API.
// These functions select, convert, sort and count the data for the views.

const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

// The API keeps ingredients in 20 separate fields:
// strIngredient1..strIngredient20 and strMeasure1..strMeasure20.
// We join them into one array and skip the empty ones.
function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim() !== '') {
      ingredients.push({
        name: name.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }
  return ingredients;
}

// Instructions come as one long text. We split it into separate steps.
// Lines like "STEP 1" or "1." alone are removed, they are only numbers.
function getSteps(instructions) {
  if (!instructions) return [];
  return instructions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .filter((line) => !/^(step\s*)?\d+\.?$/i.test(line));
}

// Turns "https://www.youtube.com/watch?v=abc123" into "https://www.youtube.com/embed/abc123"
// so the video can be shown inside an <iframe>.
function getYoutubeEmbed(url) {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// "Meat,Casserole,Pie" -> ["Meat", "Casserole", "Pie"]
function getTags(tags) {
  if (!tags) return [];
  return tags.split(',').map((t) => t.trim()).filter((t) => t !== '');
}

// Prepares one meal for the details page.
function formatMealDetails(meal) {
  const ingredients = getIngredients(meal);
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory || 'Unknown category',
    area: meal.strArea || 'Unknown cuisine',
    image: meal.strMealThumb || PLACEHOLDER_IMAGE,
    ingredients,
    ingredientCount: ingredients.length,
    steps: getSteps(meal.strInstructions),
    tags: getTags(meal.strTags),
    video: getYoutubeEmbed(meal.strYoutube),
    source: meal.strSource || null,
  };
}

// Prepares a short version of a meal for a card in a list.
// /filter.php returns only id, name and image, so category and area can be missing.
function formatMealCard(meal) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb ? `${meal.strMealThumb}/medium` : PLACEHOLDER_IMAGE,
    category: meal.strCategory || null,
    area: meal.strArea || null,
  };
}

// Sorts cards alphabetically (A-Z or Z-A).
function sortMeals(meals, order) {
  const sorted = [...meals].sort((a, b) => a.name.localeCompare(b.name));
  return order === 'desc' ? sorted.reverse() : sorted;
}

// Shortens a long text (used for category descriptions).
function shorten(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

module.exports = {
  PLACEHOLDER_IMAGE,
  getIngredients,
  getSteps,
  getYoutubeEmbed,
  getTags,
  formatMealDetails,
  formatMealCard,
  sortMeals,
  shorten,
};

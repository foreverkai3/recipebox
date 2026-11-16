// services/mealService.js
// All Axios requests to TheMealDB API are in this file.
// Controllers never call Axios directly - they use these functions.
// API docs: https://www.themealdb.com/api.php

const axios = require('axios');

// One Axios instance with the base URL, the API key and a timeout.
// Example of a full URL: https://www.themealdb.com/api/json/v1/1/search.php?s=chicken
const api = axios.create({
  baseURL: `${process.env.API_BASE_URL || 'https://www.themealdb.com/api/json/v1'}/${process.env.API_KEY || '1'}`,
  timeout: Number(process.env.API_TIMEOUT) || 5000,
});

// Creates an error with a friendly message for the user
// and technical details for the console.
function createApiError(status, userMessage, details) {
  const error = new Error(userMessage);
  error.status = status;
  error.userMessage = userMessage;
  error.details = details;
  return error;
}

// Sends a GET request and turns every kind of failure into a clear error.
async function apiGet(endpoint, params) {
  try {
    const response = await api.get(endpoint, { params });

    // The API should answer with a JSON object. If not (for example an HTML page),
    // something is wrong with the URL or the key.
    if (!response.data || typeof response.data !== 'object') {
      throw createApiError(502, 'The recipe service sent an unexpected answer. Please try again later.',
        `Non-JSON response from ${endpoint}`);
    }
    return response.data;
  } catch (err) {
    if (err.userMessage) throw err; // already our own error

    // 1) Timeout - the API was too slow
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw createApiError(504, 'The recipe service is taking too long to answer. Please try again.',
        `Timeout on ${endpoint}`);
    }

    // 2) The API answered with an error status code
    if (err.response) {
      const status = err.response.status;
      if (status === 401 || status === 403) {
        throw createApiError(502, 'The recipe service rejected our API key. Please contact the site owner.',
          `Invalid API key (${status}) on ${endpoint}`);
      }
      if (status === 429) {
        throw createApiError(429, 'Too many requests to the recipe service. Please wait a minute and try again.',
          `Rate limit (429) on ${endpoint}`);
      }
      if (status === 404) {
        throw createApiError(502, 'The requested data was not found on the recipe service.',
          `API endpoint not found (404): ${endpoint}`);
      }
      throw createApiError(502, 'The recipe service is not working right now. Please try again later.',
        `API error ${status} on ${endpoint}`);
    }

    // 3) No answer at all - no internet, wrong host, DNS error
    throw createApiError(503, 'Cannot connect to the recipe service. Check your internet connection and try again.',
      `Network error (${err.code || err.message}) on ${endpoint}`);
  }
}

// ---------- Functions used by the controllers ----------
// TheMealDB returns { meals: null } when nothing is found,
// so we always return an empty array instead of null.

// Search meals by name: /search.php?s=chicken
async function searchByName(name) {
  const data = await apiGet('/search.php', { s: name });
  return data.meals || [];
}

// Meals with a main ingredient: /filter.php?i=salmon
async function filterByIngredient(ingredient) {
  const data = await apiGet('/filter.php', { i: ingredient });
  return data.meals || [];
}

// Meals in a category: /filter.php?c=Seafood
async function filterByCategory(category) {
  const data = await apiGet('/filter.php', { c: category });
  return data.meals || [];
}

// Meals of a cuisine: /filter.php?a=Italian
async function filterByArea(area) {
  const data = await apiGet('/filter.php', { a: area });
  return data.meals || [];
}

// Full details of one meal: /lookup.php?i=52772
async function getMealById(id) {
  const data = await apiGet('/lookup.php', { i: id });
  return data.meals ? data.meals[0] : null;
}

// All categories with images and descriptions: /categories.php
async function getCategories() {
  const data = await apiGet('/categories.php');
  return data.categories || [];
}

// All cuisines (areas): /list.php?a=list
async function getAreas() {
  const data = await apiGet('/list.php', { a: 'list' });
  return data.meals || [];
}

// One random meal: /random.php
async function getRandomMeal() {
  const data = await apiGet('/random.php');
  return data.meals ? data.meals[0] : null;
}

module.exports = {
  searchByName,
  filterByIngredient,
  filterByCategory,
  filterByArea,
  getMealById,
  getCategories,
  getAreas,
  getRandomMeal,
};

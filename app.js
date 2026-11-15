// app.js - entry point of the application.
// Here we create the Express app, connect middleware, routes and error handlers.

require('dotenv').config(); // reads variables from .env into process.env

const express = require('express');
const path = require('path');

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const mealRoutes = require('./routes/mealRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- View engine: EJS templates live in the /views folder ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Built-in middleware ---
app.use(express.static(path.join(__dirname, 'public'))); // css, images
app.use(express.urlencoded({ extended: true }));          // reads form data (POST /search)

// --- Custom middleware ---
app.use(logger); // logs method, URL and time of every request

// --- Routes ---
app.use('/', mealRoutes);

// --- 404 and error handling (must be AFTER the routes) ---
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`RecipeBox is running on http://localhost:${PORT}`);
});

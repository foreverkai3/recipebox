// 404 handler and centralized error handler.

// Runs when no route matched the URL.
function notFound(req, res) {
  res.status(404).render('404', { title: 'Page not found', url: req.originalUrl });
}

// Centralized error handler. Express recognizes it by the 4 arguments (err, req, res, next).
// Every next(err) in the app ends up here.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // technical details go to the console only
  console.error('ERROR:', err.message);
  if (err.details) console.error('Details:', err.details);

  const status = err.status || 500;

  // the user gets a friendly message, never a stack trace
  res.status(status).render('error', {
    title: 'Something went wrong',
    status,
    message: err.userMessage || 'Something went wrong on our side. Please try again later.',
  });
}

module.exports = { notFound, errorHandler };

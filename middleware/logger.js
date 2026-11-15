// Custom middleware: logs every request (method, URL, time)
// and how long the server needed to answer it.

function logger(req, res, next) {
  const start = Date.now();
  const time = new Date().toLocaleString();

  // 'finish' fires when the response has been sent
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${time}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms} ms)`);
  });

  next(); // pass control to the next middleware / route
}

module.exports = logger;

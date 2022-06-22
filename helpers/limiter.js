const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes.
    max: 50, // Maximum of 100 requeset from each IP to the server.
  });

module.exports = limiter;
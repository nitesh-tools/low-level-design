const rateLimiter = require("./rateLimiter/main").default;

console.info(`Running rate limiter`);
rateLimiter();

console.info(`End!`);

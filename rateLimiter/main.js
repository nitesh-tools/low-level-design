const TokenBucket = require("./implementations/tokenBucket").default;

function rateLimiter() {
    // Initiate the bucket with capacity of 4, with 4 tokens being added every 5 seconds
    const tokenBucket = new TokenBucket(4, 4, 5);

    tokenBucket.handleRequest("user1");
    tokenBucket.handleRequest("user2");
    tokenBucket.handleRequest("user2");
    tokenBucket.handleRequest("user1");
    tokenBucket.handleRequest("user1");
    tokenBucket.handleRequest("user1");
    tokenBucket.handleRequest("user1");
    tokenBucket.handleRequest("user2");

    setTimeout(() => {
        console.info(`\n\nRunning after next cycle\n`);
        tokenBucket.handleRequest("user1");
        tokenBucket.handleRequest("user2");
        tokenBucket.handleRequest("user1");
        tokenBucket.handleRequest("user2");
    }, 8000);
}

exports.default = rateLimiter;

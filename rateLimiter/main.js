const TokenBucket = require("./implementations/tokenBucket").default;
const LeakyBucket = require("./implementations/leakyBucket").default;

function tokenBucketRateLimiter() {
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

function leakyBucketRateLimiter() {
    // Initiate the bucket with capacity of 5, with 2 tokens leaking every second
    const leakyBucket = new LeakyBucket(5, 2);

    leakyBucket.handleRequest("user1");

    setTimeout(() => {
        leakyBucket.handleRequest("user1");
        leakyBucket.handleRequest("user1");
    }, 1000);

    setTimeout(() => {
        leakyBucket.handleRequest("user1");
        leakyBucket.handleRequest("user1");
    }, 3000);

    //leakyBucket.handleRequest("user2");
    //leakyBucket.handleRequest("user2");
    //leakyBucket.handleRequest("user1");
    //leakyBucket.handleRequest("user1");
    //leakyBucket.handleRequest("user1");
    //leakyBucket.handleRequest("user1");
    //leakyBucket.handleRequest("user2");

    setTimeout(() => {
        console.info(`\n\nRunning after next cycle\n`);
        leakyBucket.handleRequest("user1");
        //leakyBucket.handleRequest("user2");
        leakyBucket.handleRequest("user1");
        //leakyBucket.handleRequest("user2");
    }, 6000);
}

exports.default = leakyBucketRateLimiter;

class TokenBucket {
    constructor(bucketCapacity, refillRate, refillTime) {
        this.bucketCapacity = bucketCapacity;
        this.refillRate = refillRate;
        this.refillTime = refillTime;
        // A memory map to hold the data
        this.cache = {};
    }

    /**
     * Creates a token bucket for a new key, when it doesn't exist otherwise return from cache.
     *
     * @param {*} key
     * @return {*}
     * @memberof TokenBucket
     */
    createBucket(key) {
        if (this.cache[key] === undefined) {
            this.cache[key] = {
                tokens: this.bucketCapacity,
                timestamp: Date.now(),
            };
        }
        return this.cache[key];
    }

    /**
     * Calculate elapsed time since the bucket is instantiated. This is useful to know if refill time is reached.
     *
     * @param {*} bucket
     * @param {*} currentTime
     * @return {*}
     * @memberof TokenBucket
     */
    findElapsedTimeForBucket(bucket, currentTime) {
        return Math.floor((currentTime - bucket.timestamp) / 1000);
    }

    /**
     * Check if refill time is reached
     *
     * @param {*} elapsedTime
     * @return {*}
     * @memberof TokenBucket
     */
    refillIntervalReached(elapsedTime) {
        return elapsedTime >= this.refillTime;
    }

    /**
     * Find total refill tokens that are generated since last request,
     * Ex. max can be bucketCapacity, number of refillRate tokens are added after every refillTime.
     *
     * @param {*} elapsedTime
     * @return {*}
     * @memberof TokenBucket
     */
    totalRefillTokens(elapsedTime) {
        const totalElapsedIntervalsForTokens = elapsedTime / this.refillTime;
        const totalNewTokens = totalElapsedIntervalsForTokens * this.refillRate;
        return totalNewTokens;
    }

    /**
     * Handles the request for the key using the token bucket.
     *
     * @param {*} key : A key based on which the request will be tracked, userId/ip/apiKey
     * @memberof TokenBucket
     */
    handleRequest(key) {
        if (!key) throw new Error(`Invalid key encountered`);

        let bucket = this.createBucket(key);
        const currentTime = Date.now();

        // Number of seconds since the time is elapsed.
        const elapsedTime = this.findElapsedTimeForBucket(bucket, currentTime);

        if (this.refillIntervalReached(elapsedTime)) {
            const totalNewTokens = totalRefillTokens(elapsedTime);

            bucket = {
                tokens: Math.min(this.cache[key].tokens + totalNewTokens, this.bucketCapacity),
                timestamp: Date.now(),
            };

            this.cache[key] = bucket;
            console.info(`Request processing for key: ${key}, Remaining tokens: ${this.cache[key].tokens}`);
        } else {
            if (bucket.tokens <= 0) {
                console.info(`Request rejected for key: ${key}, Remaining tokens: ${this.cache[key].tokens}`);
            } else {
                console.info(`Request processing for key: ${key}, Remaining tokens: ${this.cache[key].tokens}`);
            }
        }

        bucket.tokens -= 1;
    }
}

exports.default = TokenBucket;

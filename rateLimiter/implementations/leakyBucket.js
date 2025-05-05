class LeakyBucket {
    constructor(bucketCapacity, leakRatePerSecond) {
        this.bucketCapacity = bucketCapacity;
        this.leakRatePerSecond = leakRatePerSecond;
        // A memory map to hold the data
        this.cache = {};
    }

    /**
     * Creates a empty leaky bucket for a new key, when it doesn't exist otherwise return from cache.
     *
     * @param {*} key
     * @return {*}
     * @memberof TokenBucket
     */
    createBucket(key) {
        if (this.cache[key] === undefined) {
            this.cache[key] = {
                size: 0, // When initiated it is empty
                timestamp: Date.now(),
            };
        }
        return this.cache[key];
    }

    /**
     * Calculate elapsed time since the bucket's last update.
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
     * "Leaks" tokens from the bucket based on the elapsed time and leak rate.
     *
     * @param {*} bucket
     * @param {*} elapsedTime
     * @memberof LeakyBucket
     */
    leak(bucket, elapsedTime) {
        // Calculate total number of leaked token since last time.
        const leakedTokens = elapsedTime * this.leakRatePerSecond;

        // Leak the requests from bucket, at most the bucket can be empty.
        bucket.size = Math.max(0, bucket.size - leakedTokens);
        bucket.timestamp = Date.now();
        return bucket;
    }

    /**
     * Handles the request for the key using the leaky bucket.
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

        // Leak the bucket before adding a new request. For practical purposes, push the requests to some outer process.
        bucket = this.leak(bucket, elapsedTime);

        if (bucket.size < this.bucketCapacity) {
            // If the bucket size is less than capacity, that means, request can be processed. Increase bucket size.
            bucket.size += 1;
            console.info(
                `Request processing for key: ${key}, Remaining size: ${this.cache[key].size}, ElapsedTime: ${elapsedTime}`
            );
        } else {
            // Else request cannot be processed.
            console.info(
                `Request rejected for key: ${key}, Remaining size: ${this.cache[key].size}, ElapsedTime: ${elapsedTime}`
            );
        }
    }
}

exports.default = LeakyBucket;

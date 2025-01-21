// utils/rateLimitedFetch.js

class RateLimiter {
	constructor(maxRequests, perMilliseconds) {
		this.maxRequests = maxRequests;
		this.perMilliseconds = perMilliseconds;
		this.requests = [];
	}

	async throttle() {
		const now = Date.now();

		// Remove requests older than the time window
		this.requests = this.requests.filter((timestamp) => now - timestamp < this.perMilliseconds);

		// If we've hit the limit, wait until the oldest request expires
		if (this.requests.length >= this.maxRequests) {
			const oldestRequest = this.requests[0];
			const timeToWait = oldestRequest + this.perMilliseconds - now;
			await new Promise((resolve) => setTimeout(resolve, timeToWait));
			return this.throttle(); // Recheck after waiting
		}

		// Add current request timestamp
		this.requests.push(now);
	}
}

const rateLimiter = new RateLimiter(120, 60000); // 120 requests per minute

export async function rateLimitedFetch(url, options = {}) {
	await rateLimiter.throttle();
	return fetch(url, options);
}

// Rate limiting storage (in-memory, reset on server restart)
const globalForRateLimit = global as unknown as {
  emailRateLimits: Map<string, { count: number; resetAt: number }>;
};

export const emailRateLimits = globalForRateLimit.emailRateLimits || new Map();
if (!globalForRateLimit.emailRateLimits) {
  globalForRateLimit.emailRateLimits = emailRateLimits;
}

export function checkRateLimit(email: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now();
  const limit = emailRateLimits.get(email);

  // Clean up expired entries
  if (limit && limit.resetAt < now) {
    emailRateLimits.delete(email);
  }

  const current = emailRateLimits.get(email);

  if (!current) {
    // First request
    emailRateLimits.set(email, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour
    });
    return { allowed: true };
  }

  if (current.count >= 5) {
   // Max 5 requests per hour
    const resetIn = Math.ceil((current.resetAt - now) / 1000 / 60); // minutes
    return { allowed: false, resetIn };
  }

  current.count++;
  return { allowed: true };
}

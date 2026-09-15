type RateLimitOptions = {
  windowMs: number;
  max: number;
  message: string;
  key?: (req: any) => string;
};

type Entry = { count: number; resetAt: number };

export const createRateLimit = ({ windowMs, max, message, key }: RateLimitOptions) => {
  const attempts = new Map<string, Entry>();

  return (req: any, res: any, next: any) => {
    const now = Date.now();
    if (attempts.size > 10_000) {
      for (const [attemptKey, entry] of attempts) {
        if (entry.resetAt <= now) attempts.delete(attemptKey);
      }
    }
    const identifier = key?.(req) || req.ip || req.socket?.remoteAddress || 'unknown';
    const current = attempts.get(identifier);

    if (!current || current.resetAt <= now) {
      attempts.set(identifier, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((current.resetAt - now) / 1000))));
      return res.status(429).json({ error: message });
    }

    next();
  };
};

const buckets = new Map();

const getClientIp = (req) => {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
};

const cleanupBucket = (key, now) => {
  const entry = buckets.get(key);
  if (entry && entry.resetAt <= now) {
    buckets.delete(key);
  }
};

const rateLimit = ({ windowMs, max, message }) => {
  return (req, res, next) => {
    const key = `${getClientIp(req)}:${req.baseUrl}${req.path}`;
    const now = Date.now();

    cleanupBucket(key, now);

    let entry = buckets.get(key);
    if (!entry) {
      entry = { count: 0, resetAt: now + windowMs };
      buckets.set(key, entry);
    }

    entry.count += 1;

    res.set("X-RateLimit-Limit", String(max));
    res.set("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)));
    res.set("X-RateLimit-Reset", String(entry.resetAt));

    if (entry.count > max) {
      return res.status(429).json({ message: message || "Too many requests" });
    }

    next();
  };
};

export default rateLimit;

const buckets = new Map();

function checkRateLimit(key, windowMs) {
  const now = Date.now();
  const last = buckets.get(key) || 0;
  if (now - last < windowMs) {
    return false;
  }
  buckets.set(key, now);
  return true;
}

module.exports = {
  checkRateLimit
};

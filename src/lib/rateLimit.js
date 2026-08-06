const RATE_LIMIT_EVENT = 'api:rate-limited';

function toPositiveSeconds(value) {
  const seconds = Number.parseInt(value, 10);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

export function notifyRateLimited({ message, retryAfter, data } = {}) {
  const retryAfterSeconds =
    toPositiveSeconds(data?.error?.retryAfterSeconds) ??
    toPositiveSeconds(retryAfter) ??
    60;

  window.dispatchEvent(
    new CustomEvent(RATE_LIMIT_EVENT, {
      detail: {
        message: message || 'Too many requests. Please try again shortly.',
        retryAfterSeconds,
      },
    }),
  );
}

export { RATE_LIMIT_EVENT };

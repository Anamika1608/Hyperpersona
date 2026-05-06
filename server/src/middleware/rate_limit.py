"""Sliding-window rate limit (Redis-backed).

Counts requests per X-API-Key in fixed 60s windows. Configurable via
RATE_LIMIT_PER_MINUTE env var (default 100). Same public-path exclusions
as the auth middleware. Fails open if Redis is unreachable so a Redis
hiccup doesn't take down the API.

Adds these response headers on success:
  X-RateLimit-Limit        — the configured per-minute limit
  X-RateLimit-Remaining    — how many requests are left in this window

Adds these on rejection:
  Retry-After              — seconds until the next window opens
"""

import logging
import time

import redis as _redis
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


PUBLIC_PATHS = {"/health", "/", "/docs", "/openapi.json", "/redoc"}

log = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        redis_client: _redis.Redis,
        limit_per_minute: int = 100,
    ) -> None:
        super().__init__(app)
        self.redis = redis_client
        self.limit = limit_per_minute
        self.window_s = 60

    async def dispatch(self, request: Request, call_next):
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        api_key = request.headers.get("x-api-key", "anonymous")
        window = int(time.time() // self.window_s)
        bucket_key = f"ratelimit:{api_key}:{window}"

        try:
            count = self.redis.incr(bucket_key)
            if count == 1:
                # set TTL only on first hit; small buffer to avoid edge race
                self.redis.expire(bucket_key, self.window_s + 5)
        except _redis.RedisError as e:
            # Fail open — log it but don't block the API on a Redis blip
            log.warning("rate limit redis error", extra={"error": str(e)})
            return await call_next(request)

        if count > self.limit:
            log.info(
                "rate limit hit",
                extra={"api_key_prefix": api_key[:8], "count": count, "limit": self.limit},
            )
            response = JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "rate limit exceeded",
                    "limit_per_minute": self.limit,
                },
            )
            response.headers["Retry-After"] = str(self.window_s)
            return response

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.limit)
        response.headers["X-RateLimit-Remaining"] = str(max(0, self.limit - count))
        return response

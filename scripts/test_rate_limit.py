"""Verify the sliding-window rate limit kicks in.

Sends N requests to a cheap endpoint (/jobs/<bogus>) and tallies the
response codes. With the default limit of 100/min, the first ~100
requests should return 404 (job doesn't exist) and the rest should
return 429.

Usage: make test-rate-limit              (defaults: N=150)
       N=300 make test-rate-limit
"""

import json
import os
import urllib.error
import urllib.request
from collections import Counter

BASE_URL = os.getenv("HYPERPERSONA_BASE_URL", "http://server:8000")
API_KEY = os.getenv("API_KEY", "test-key")
N = int(os.getenv("N", "150"))


def _hit() -> tuple[int, str | None]:
    req = urllib.request.Request(f"{BASE_URL}/jobs/rate-limit-probe")
    req.add_header("X-API-Key", API_KEY)
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            return r.status, r.headers.get("X-RateLimit-Remaining")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Retry-After") if e.code == 429 else None


def main() -> None:
    print(f"firing {N} requests at {BASE_URL}/jobs/rate-limit-probe...")
    counts: Counter = Counter()
    last_404_remaining: str | None = None
    first_429_at: int | None = None
    for i in range(1, N + 1):
        code, header = _hit()
        counts[code] += 1
        if code == 404 and header is not None:
            last_404_remaining = header
        if code == 429 and first_429_at is None:
            first_429_at = i

    print()
    print("response distribution:")
    for code, count in sorted(counts.items()):
        label = {200: "ok", 404: "not-found (allowed)", 429: "rate limited"}.get(code, "")
        print(f"  {code} {label:25} {count}")

    print()
    if last_404_remaining is not None:
        print(f"last X-RateLimit-Remaining (during 404s): {last_404_remaining}")
    if first_429_at is not None:
        print(f"first 429 happened on request #{first_429_at}")
        print("PASS — rate limit is working")
    else:
        print("note: no 429s observed. Either limit is higher than N or window rolled over.")


if __name__ == "__main__":
    main()

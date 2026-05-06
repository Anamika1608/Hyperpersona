"""ACE conflict-detection demo — runs against whatever LLM is configured.

Seeds 3 facts directly into OpenSearch (bypassing the analyzer):
  Old positive  (200d ago):  "Nike trail shoes" polarity=+1
  Recent neg    (5d ago):    "Nike trail shoes" polarity=-1  ← should win
  Recent pos    (3d ago):    "prefers waterproof gear" polarity=+1

Both Nike facts share text → same normalized key, so ACE groups them.
With opposite polarities, ACE flags it as a conflict and keeps the
more recent (-1) fact.

Embeds via whatever BEDROCK_MODE is set, so seed vectors align with
the recommender's query embeddings. Run from the worker container so
Gemini is available when BEDROCK_MODE=gemini.

Usage: make demo-conflict
"""

import json
import os
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from uuid import uuid4

from opensearchpy import OpenSearch

from shared.bedrock import make_bedrock_client


BASE_URL = os.getenv("HYPERPERSONA_BASE_URL", "http://server:8000")
API_KEY = os.getenv("API_KEY", "test-key")
OS_HOST = os.getenv("OPENSEARCH_HOST", "opensearch")
OS_PORT = int(os.getenv("OPENSEARCH_PORT", "9200"))

CUSTOMER = "demo_conflict_user"


def _api_request(
    method: str, path: str, body: dict | None = None
) -> tuple[int, dict | None]:
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, method=method, data=data)
    req.add_header("X-API-Key", API_KEY)
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            text = resp.read().decode() or "null"
            return resp.status, json.loads(text)
    except urllib.error.HTTPError as e:
        text = e.read().decode() or "null"
        try:
            return e.code, json.loads(text)
        except json.JSONDecodeError:
            return e.code, {"raw": text}


def main() -> None:
    mode = os.getenv("BEDROCK_MODE", "mock")
    bedrock = make_bedrock_client(
        mode=mode,
        region=os.getenv("BEDROCK_REGION", "us-east-1"),
        text_model=os.getenv("BEDROCK_TEXT_MODEL", "anthropic.claude-sonnet-4-5-20250929-v1:0"),
        embed_model=os.getenv("BEDROCK_EMBED_MODEL", "amazon.titan-embed-text-v2:0"),
        gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
        gemini_text_model=os.getenv("GEMINI_TEXT_MODEL", "gemini-2.5-flash"),
        gemini_embed_model=os.getenv("GEMINI_EMBED_MODEL", "gemini-embedding-001"),
        gemini_embed_dim=int(os.getenv("GEMINI_EMBED_DIM", "1024")),
    )
    os_client = OpenSearch(
        hosts=[{"host": OS_HOST, "port": OS_PORT}],
        use_ssl=False,
        verify_certs=False,
    )

    print("=" * 64)
    print(f"CONFLICT DEMO — mode={mode}")
    print("=" * 64)

    _api_request("POST", "/consent", {
        "customer_id": CUSTOMER,
        "scopes": ["personalization", "analytics"],
    })
    print(f"created consent for {CUSTOMER}")

    # Wipe prior demo state for this customer
    os_client.delete_by_query(
        index="customer-facts",
        body={"query": {"term": {"customer_id": CUSTOMER}}},
        refresh=True,
    )

    now = datetime.now(timezone.utc)
    facts = [
        {
            "text": "Nike trail shoes",
            "polarity": 1,
            "timestamp": (now - timedelta(days=200)).isoformat(),
        },
        {
            "text": "Nike trail shoes",
            "polarity": -1,
            "timestamp": (now - timedelta(days=5)).isoformat(),
        },
        {
            "text": "prefers waterproof gear",
            "polarity": 1,
            "timestamp": (now - timedelta(days=3)).isoformat(),
        },
    ]

    for f in facts:
        os_client.index(
            index="customer-facts",
            id=str(uuid4()),
            body={
                "vector": bedrock.embed(f["text"]),
                "customer_id": CUSTOMER,
                "text": f["text"],
                "source_event": "demo_seed",
                "polarity": f["polarity"],
                "timestamp": f["timestamp"],
            },
            refresh="wait_for",
        )
        days_ago = (now - datetime.fromisoformat(f["timestamp"])).days
        print(f"  seeded: {f['text']:30} polarity={f['polarity']:+d}  ({days_ago}d ago)")

    print()
    print("=" * 64)
    print("RUNNING /recommend WITH 'looking for nike running shoes'")
    print("=" * 64)

    s, b = _api_request(
        "GET",
        "/recommend?" + urlencode({
            "customer_id": CUSTOMER,
            "context": "looking for nike running shoes",
        }),
    )
    print(f"GET /recommend → {s}")
    print(f"  facts_retrieved : {b.get('facts_retrieved')}")
    print(f"  facts_used      : {b.get('facts_used')}")
    print(f"  conflicts       : {b.get('conflicts')}")
    print(f"  offer (head)    : {(b.get('offer') or '')[:240]}")

    print()
    if b.get("conflicts"):
        print(f"PASS — ACE detected conflicts: {b['conflicts']}")
        print("       The more recent (-1) fact won the dedup.")
    else:
        print("note: no conflicts surfaced. Possible causes:")
        print("  - similarity below FACT_SCORE_THRESHOLD (0.12) — try real LLM mode")
        print("  - normalize_key heuristic grouped them differently")

    # Tidy up
    _api_request("DELETE", f"/customer/{CUSTOMER}")
    print(f"\ncleaned up {CUSTOMER}")


if __name__ == "__main__":
    main()

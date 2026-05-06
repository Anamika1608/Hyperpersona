"""Delete all documents from the 3 OpenSearch collections, keeping the
indexes themselves intact.

Useful when switching LLM backends — vectors from Mock are not comparable
to vectors from Gemini or Titan, so wiping prevents stale data from
polluting retrieval results.

Usage: make wipe-vectors
"""

import os

from opensearchpy import OpenSearch
from opensearchpy.exceptions import NotFoundError, OpenSearchException

HOST = os.getenv("OPENSEARCH_HOST", "localhost")
PORT = int(os.getenv("OPENSEARCH_PORT", "9200"))

COLLECTIONS = ["customer-facts", "behavior-embeddings", "session-summaries"]


def main() -> None:
    client = OpenSearch(
        hosts=[{"host": HOST, "port": PORT}],
        use_ssl=False,
        verify_certs=False,
    )
    for coll in COLLECTIONS:
        try:
            result = client.delete_by_query(
                index=coll,
                body={"query": {"match_all": {}}},
                refresh=True,
            )
            print(f"wiped {coll:25} {result.get('deleted', 0)} doc(s)")
        except NotFoundError:
            print(f"skip  {coll:25} index does not exist")
        except OpenSearchException as e:
            print(f"error {coll:25} {e}")


if __name__ == "__main__":
    main()

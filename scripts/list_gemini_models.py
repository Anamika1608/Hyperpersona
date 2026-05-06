"""List models the current GEMINI_API_KEY can call.

Usage: make list-gemini-models
"""

import os

from shared.gemini import GeminiClient


def main() -> None:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        print("error: GEMINI_API_KEY is not set")
        return

    client = GeminiClient(
        api_key=api_key,
        text_model=os.getenv("GEMINI_TEXT_MODEL", "gemini-2.5-flash"),
        embed_model=os.getenv("GEMINI_EMBED_MODEL", "gemini-embedding-001"),
        embed_dim=int(os.getenv("GEMINI_EMBED_DIM", "1024")),
    )

    models = client.list_models()
    print(f"{len(models)} model(s) accessible:")
    print()
    print(f"{'name':50} actions")
    print("-" * 70)
    for m in sorted(models, key=lambda x: x["name"]):
        actions = ",".join(m["supported_actions"][:3]) or "—"
        print(f"{m['name']:50} {actions}")


if __name__ == "__main__":
    main()

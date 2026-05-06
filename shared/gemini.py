"""Google Gemini-backed LLM client (Google AI Studio API).

Implements the same shape as BedrockClient (embed, generate) so it plugs
into the existing factory in shared/bedrock.py. Activated when
BEDROCK_MODE=gemini.

Embedding dimension MUST match the OpenSearch index dim (1024 by default,
matching real Titan v2). For gemini-embedding-001 we explicitly pass
output_dimensionality=1024 — without it the API returns 3072 and
OpenSearch will reject the upsert.

Embeddings are unit-normalized so cosine similarity == dot product, the
same way Mock + Titan vectors behave.

To use:
  pip install google-genai
  export GEMINI_API_KEY=AIza...
  export BEDROCK_MODE=gemini

Free-tier signup: https://aistudio.google.com/apikey
"""

import logging
import math

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
)

log = logging.getLogger(__name__)


class GeminiClient:
    def __init__(
        self,
        api_key: str,
        text_model: str = "gemini-2.5-flash",
        embed_model: str = "gemini-embedding-001",
        embed_dim: int = 1024,
    ) -> None:
        # Lazy import — only paid when this client is actually constructed
        from google import genai
        from google.genai import types
        self._types = types
        self.client = genai.Client(api_key=api_key)
        self.text_model = text_model
        self.embed_model = embed_model
        self.embed_dim = embed_dim

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        reraise=True,
    )
    def embed(self, text: str) -> list[float]:
        result = self.client.models.embed_content(
            model=self.embed_model,
            contents=text,
            config=self._types.EmbedContentConfig(
                output_dimensionality=self.embed_dim,
            ),
        )
        vector = list(result.embeddings[0].values)
        # Unit-normalize so cosine == dot product (Titan does this; Mock
        # does this; Gemini at non-3072 dims does not by default).
        mag = math.sqrt(sum(x * x for x in vector))
        return [x / mag for x in vector] if mag > 0 else vector

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        reraise=True,
    )
    def generate(self, prompt: str, system: str = "", max_tokens: int = 1024) -> str:
        config_kwargs: dict = {"max_output_tokens": max_tokens}
        if system:
            config_kwargs["system_instruction"] = system
        response = self.client.models.generate_content(
            model=self.text_model,
            contents=prompt,
            config=self._types.GenerateContentConfig(**config_kwargs),
        )
        return response.text or ""

    def list_models(self) -> list[dict]:
        """Return the models the current API key has access to.

        Useful when you hit '404 model not found' — confirms what's
        actually callable. Each entry is {name, supported_methods}.
        """
        out: list[dict] = []
        for m in self.client.models.list():
            out.append({
                "name": getattr(m, "name", ""),
                "supported_actions": list(getattr(m, "supported_actions", []) or []),
            })
        return out

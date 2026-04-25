from __future__ import annotations
import os
import httpx
from dotenv import load_dotenv

load_dotenv()


class K2Client:
    def __init__(self):
        self.base_url = os.getenv("K2_BASE_URL", "https://api.cerebras.ai/v1")
        self.api_key = os.getenv("K2_API_KEY", "")
        self.model = os.getenv("K2_MODEL", "k2-think-v2")

    async def chat(self, system: str, user: str, max_tokens: int = 80) -> str:
        if not self.api_key:
            return "[K2_API_KEY not set]"

        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": max_tokens,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"].strip()

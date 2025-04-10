import os
from openai import OpenAI

# 1. Guardrailing Rules

guardrails = """
raise "Rule 1: Do not talk about Fight Club" if: 
    (msg: Message)
    "fight club" in msg.content
"""


# 2. Gateway Integration

client = OpenAI(
    default_headers={
        "Invariant-Authorization": "Bearer " + os.getenv("INVARIANT_API_KEY"),
        "Invariant-Guardrails": guardrails.encode("unicode_escape"),
    },
    base_url="https://explorer.invariantlabs.ai/api/v1/gateway/openai",
)

# 3. Using the model
client.chat.completions.create(
    messages=[{"role": "user", "content": "What do you know about Fight Club?"}],
    model="gpt-4o",
)

title: Reference for Rule Writing
description: A concise reference for writing guardrailing rules with Invariant.
icon: bootstrap/book

# Reference for Rule Writing

<div class="subtitle">
A concise reference for writing guardrailing rules with Invariant.
</div>

## Setting Up Your LLM Client

To get started with guardrailing, you have to setup your LLM client to use [Invariant Gateway](../gateway/index.md):

**Example:** Setting Up Your OpenAI client to use Guardrails
```python hl_lines='8 9 10 16 17 18 19 20 21 22 23 24'
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
```

Before you run, make sure you export the relevant environment variables including an `INVARIANT_API_KEY` [(get one here)](https://explorer.invariantlabs.ai/settings), which you'll need to access Gateway and our low-latency Guardrailing API.
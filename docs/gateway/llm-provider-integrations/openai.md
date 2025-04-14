---
title: OpenAI Integration
description: Using Invariant Gateway with OpenAI
---

# OpenAI Integration

<div class='subtitle'>Using Invariant Gateway with OpenAI</div>

With just a few changes in your `OpenAI` client setup, you can start using the Invariant Gateway to visualize and debug your traces.

## Getting the Invariant API Key

First, you need to obtain your Invariant API key. This key is essential for authenticating your requests to the Invariant Gateway.

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## Setup OpenAI API Key

In your runtime environment, set the OpenAI API key as an environment variable. This is necessary for the OpenAI client to authenticate requests.

```bash
export OPENAI_API_KEY={your-openai-api-key}
```

## Code

You can now use the Invariant Gateway with your Anthropic client as follows:

```python
from httpx import Client
from openai import OpenAI

http_client = Client(
    headers={
        "Invariant-Authorization": "Bearer {your-invariant-api-key}"
    },
)
openai_client = OpenAI(
    http_client=http_client,
    base_url="https://explorer.invariantlabs.ai/api/v1/gateway/{your-dataset-name}/openai",
)

result = openai_client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "What is the capital of France?"},
    ],
)
print("result: ", result)
```

This code will push your trace to the [Invariant Explorer](https://explorer.invariantlabs.ai/) where it will be available under the dataset name used above, i.e. `your-dataset-name`.

## Explore Other Integrations

<div class='tiles'>

<a href="../anthropic" class='tile'>
    <span class='tile-title'>Anthropic Integration →</span>
     <span class='tile-description'>Leverage the Invariant Gateway for smooth Anthropic API interactions.</span>
</a>

<a href="../gemini" class='tile'>
    <span class='tile-title'>Gemini Integration →</span>
     <span class='tile-description'>Leverage the Invariant Gateway for smooth Gemini API interactions.</span>
</a>

<a href="../../agent-integrations/openai-swarm" class='tile'>
    <span class='tile-title'>OpenAI Swarm Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenAI Swarm agents effortlessly using the Gateway.</span>
</a>

</div>

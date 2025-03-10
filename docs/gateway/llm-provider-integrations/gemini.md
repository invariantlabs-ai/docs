# Gemini Integration

With just a few changes in your ```Gemini``` client setup, you can start using the Invariant Gateway to visualize and debug your traces.


## Getting the Invariant API Key

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## Setup Gemini API Key

```bash
export GEMINI_API_KEY={your-anthropic-api-key}
```

## Code

```python
import os

from google import genai

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"],
    http_options={
        "base_url": "https://explorer.invariantlabs.ai/api/v1/gateway/{add-your-dataset-name-here}/gemini",
        "headers": {
            "Invariant-Authorization": "Bearer your-invariant-api-key"
        },
    },
)

result = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain how SSL works",
    config={
        "maxOutputTokens": 200
    },
)

print("result: ", result)
```

This would push your trace to the [Invariant Explorer](https://explorer.invariantlabs.ai/) where it will be available under the dataset used above.

## Explore other integrations

<div class='tiles'>

<a href="../openai" class='tile'>
    <span class='tile-title'>OpenAI Integration →</span>
    <span class='tile-description'>Seamlessly connect to OpenAI APIs through the Invariant Gateway.</span>
</a>

<a href="../anthropic" class='tile'>
    <span class='tile-title'>Anthropic Integration →</span>
     <span class='tile-description'>Leverage the Invariant Gateway for smooth Anthropic API interactions.</span>
</a>

<a href="../../agent-integrations/openai-swarm" class='tile'>
    <span class='tile-title'>OpenAI Swarm Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenAI Swarm agents effortlessly using the Gateway.</span>
</a>

</div>
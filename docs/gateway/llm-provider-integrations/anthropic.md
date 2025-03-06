# Anthropic Integration

With just a few changes in your ```Anthropic``` client setup, you can start using the Invariant Gateway to visualize and debug your traces.


## Getting the Invariant API Key

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## Setup Anthropic API Key

```bash
export ANTHROPIC_API_KEY={your-anthropic-api-key}
```

## Code

```python
from anthropic import Anthropic
from httpx import Client

http_client = Client(
    headers={
        "Invariant-Authorization": "Bearer {your-invariant-api-key}"
    },
)
anthropic_client = Anthropic(
    http_client=http_client,
    base_url="https://explorer.invariantlabs.ai/api/v1/gateway/{your-dataset-name}/anthropic",
)

result = anthropic_client.messages.create(
    model="claude-3-5-sonnet-20241022",
    messages=[
        {"role": "user", "content": "What is the capital of France?"},
    ],
)
print("result: ", result)
```

This would push your trace to the [Invariant Explorer](https://explorer.invariantlabs.ai/) where it will be available under the dataset used above.

## Explore other integrations

<div class='tiles'>

<a href="../anthropic" class='tile'>
    <span class='tile-title'>OpenAI Integration →</span>
    <span class='tile-description'>Seamlessly connect to OpenAI APIs through the Invariant Gateway.</span>
</a>

<a href="../../agent-integrations/microsoft-autogen" class='tile'>
    <span class='tile-title'>Microsoft AutoGen Integration →</span>
    <span class='tile-description'>Enhance and debug your Microsoft AutoGen agents effortlessly using the Gateway.</span>
</a>

<a href="../../agent-integrations/openai-swarm" class='tile'>
    <span class='tile-title'>OpenAI Swarm Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenAI Swarm agents effortlessly using the Gateway.</span>
</a>

</div>
# Anthropic Integration

<div class='subtitle'>Using Invariant Gateway with Anthropic</div>

With just a few changes in your `Anthropic` client setup, you can start using the Invariant Gateway to visualize and debug your traces with Invariant.

## Getting the Invariant API Key

First, you need to obtain your Invariant API key. This key is essential for authenticating your requests to the Invariant Gateway.

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## Setup Anthropic API Key

In your runtime environment, set the Anthropic API key as an environment variable. This is necessary for the Anthropic client to authenticate requests.

```bash
export ANTHROPIC_API_KEY={your-anthropic-api-key}
```

## Code

You can now use the Invariant Gateway with your Anthropic client as follows:

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

This code will push your trace to the [Invariant Explorer](https://explorer.invariantlabs.ai/) where it will be available under the dataset name used above, i.e. `your-dataset-name`.

## Explore Other Integrations

<div class='tiles'>

<a href="../openai" class='tile'>
    <span class='tile-title'>OpenAI Integration →</span>
    <span class='tile-description'>Seamlessly connect to OpenAI APIs through the Invariant Gateway.</span>
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

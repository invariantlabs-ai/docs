---
title: OpenAI Swarm Integration
description: Use Gateway with OpenAI Swarm
---

# OpenAI Swarm Integration

<div class='subtitle'>Use Gateway with OpenAI Swarm</div>

[OpenAI Swarm](https://github.com/openai/swarm) relies on OpenAI's Python client, which makes it very easy to integrate Gateway, similar to the standard [OpenAI integration](../llm-provider-integrations/openai.md).

## Getting the Invariant API Key

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## Code

You can now use the Invariant Gateway with your OpenAI Swarm client as follows:

```python
from swarm import Swarm, Agent
from openai import OpenAI
from httpx import Client
import os

client = Swarm(
    client=OpenAI(
        http_client=Client(headers={"Invariant-Authorization": "Bearer " + os.getenv("INVARIANT_API_KEY", "")}),
        base_url="https://explorer.invariantlabs.ai/api/v1/gateway/weather-swarm-agent/openai",
    )
)


def get_weather():
    return "It's sunny."


agent = Agent(
    name="Agent A",
    instructions="You are a helpful agent.",
    functions=[get_weather],
)

response = client.run(
    agent=agent,
    messages=[{"role": "user", "content": "What's the weather?"}],
)

print(response.messages[-1]["content"])
# Output: "It seems to be sunny."
```

This will automatically trace your agent interactions in Invariant Explorer.

## Explore Other Integrations

<div class='tiles'>

<a href="../microsoft-autogen" class='tile'>
    <span class='tile-title'>Microsoft AutoGen Integration →</span>
    <span class='tile-description'>Enhance and debug your Microsoft AutoGen agents effortlessly using the Gateway.</span>
</a>

<a href="../openhands" class='tile'>
    <span class='tile-title'>OpenHands Integration →</span>
    <span class='tile-description'>Streamline the development and debugging of OpenHands applications with the Gateway.</span>
</a>

<a href="../swe-agent" class='tile'>
    <span class='tile-title'>SWE-agent Integration →</span>
    <span class='tile-description'>Streamline the development and debugging of SWE-agent applications with the Gateway.</span>
</a>

<a href="../browser-use" class='tile'>
    <span class='tile-title'>Browser Use Integration →</span>
    <span class='tile-description'>Optimize and troubleshoot your Browser Use applications with Invariant Gateway.</span>
</a>

</div>

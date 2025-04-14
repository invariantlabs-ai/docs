---
title: OpenAI Agents SDK
description: Use Gateway with the Agents SDK
---

# OpenAI Agents SDK

<div class='subtitle'>Use Gateway with the Agents SDK</div>

[OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) relies on OpenAI's Python client, which makes it very easy to integrate Gateway, similar to the standard [OpenAI integration](../llm-provider-integrations/openai.md).

## Getting the Invariant API Key

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## SDK Integration

You can then use Gateway with the Agents SDK by re-configuring the OpenAI client's base URL:

```python
from agents import Agent, OpenAIChatCompletionsModel, Runner, function_tool
from openai import AsyncOpenAI
import os

external_client = AsyncOpenAI(
    base_url="https://explorer.invariantlabs.ai/api/v1/gateway/weather-agent/openai",
    default_headers={
        "Invariant-Authorization": "Bearer " + os.getenv("INVARIANT_API_KEY"),
    },
)


@function_tool
async def fetch_weather(location: str) -> str:
    return "sunny"


agent = Agent(
    name="Assistant",
    instructions="You are a helpful assistant",
    model=OpenAIChatCompletionsModel(
        model="gpt-4o",
        openai_client=external_client,
    ),
    tools=[fetch_weather],
)

result = Runner.run_sync(
    agent,
    "What is the weather like in Paris?",
)
print(result.final_output)

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

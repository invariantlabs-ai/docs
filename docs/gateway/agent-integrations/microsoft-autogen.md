# Microsoft AutoGen Integration

<div class='subtitle'>Integrate Gateway with AutoGen</div>

[Microsoft AutoGen](https://github.com/microsoft/autogen) is an open-source programming framework for building AI agents and facilitating cooperation among multiple agents to solve tasks.

You can easily modify the AutoGen setup to use the Invariant Gateway.

## Getting the Invariant API Key

First, you need to obtain your Invariant API key. This key is essential for authenticating your requests to the Invariant Gateway.

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## Code

You can now use the Invariant Gateway with your AutoGen client as follows:

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

import os
from httpx import AsyncClient

async def main() -> None:
    client = OpenAIChatCompletionClient(
        model="gpt-4o",
        http_client=AsyncClient(headers={"Invariant-Authorization": "Bearer " + os.getenv("INVARIANT_API_KEY", "")}),
        base_url="https://explorer.invariantlabs.ai/api/v1/gateway/weather-swarm-agent/openai",
    )
    agent = AssistantAgent("assistant", client)
    print(await agent.run(task="Say 'Hello World!'"))


asyncio.run(main())
# Output: "Hello World!"
```

This will automatically trace your agent interactions in Invariant Explorer.

## Explore Other Integrations

<div class='tiles'>

<a href="../openai-swarm" class='tile'>
    <span class='tile-title'>OpenAI Swarm Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenAI Swarm agents effortlessly using the Gateway.</span>
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

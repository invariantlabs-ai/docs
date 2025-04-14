---
title: Browser Use Integration
description: Use Gateway with <code>browser-use</code>
---

# Browser Use Integration

<div class='subtitle'>Use Gateway with <code>browser-use</code></div>

[Browser Use](https://github.com/browser-use/browser-use) is a simple library to connect your AI agents with the browser.

You can easily modify the Browser Use setup to use the Invariant Gateway.

## Getting the Invariant API Key

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

## Adjust the API Key Format

`browser-use` does not support custom headers, so you **cannot** pass the Invariant API Key via the `Invariant-Authorization` header as usual.

However, you can still use Gateway by relying on its support for secret key concatenation.

Instead of setting your LLM Provider's API Key normally, modify the environment variable as follows:

```bash
export OPENAI_API_KEY={your-openai-api-key};invariant-auth={your-invariant-api-key}
export ANTHROPIC_API_KEY={your-anthropic-api-key};invariant-auth={your-invariant-api-key}
```

## Code

You can now use the Invariant Gateway with your `browser-use` client as follows:

```python
import asyncio

from browser_use import Agent
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()


async def main():
    agent = Agent(
        task="Go to Reddit, search for 'browser-use', click on the first post and return the first comment.",
        llm=ChatOpenAI(
            model="gpt-4o",
            base_url="https://explorer.invariantlabs.ai/api/v1/gateway/{add-your-dataset-name-here}/openai",
        ),
    )
    result = await agent.run()
    print(result)


asyncio.run(main())
```

> **Note:** Do not include the curly braces `{}`.

The Invariant Gateway extracts the `invariant-auth` field from the API key and correctly forwards it to Invariant Explorer while sending the actual API key to OpenAI or Anthropic.

This will automatically trace your agent interactions in Invariant Explorer.

## Explore Other Integrations

<div class='tiles'>

<a href="../microsoft-autogen" class='tile'>
    <span class='tile-title'>Microsoft AutoGen Integration →</span>
    <span class='tile-description'>Enhance and debug your Microsoft AutoGen agents effortlessly using the Gateway.</span>
</a>

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
</div>

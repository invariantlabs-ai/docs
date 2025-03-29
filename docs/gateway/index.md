---
title: Overview
---

# Getting Started With Gateway

<div class='subtitle'>An LLM proxy to observe and debug what your AI agents are doing</div>

[Invariant Gateway](https://github.com/invariantlabs-ai/invariant-gateway) is a lightweight _zero-configuration_ service that acts as an intermediary between AI Agents and LLM providers (such as OpenAI and Anthropic).

Gateway automatically traces agent interactions and stores them in the [Invariant Explorer](https://explorer.invariantlabs.ai/), giving you insights into what your agents are doing.
This enables you to _easily observe and debug_ your agent applications without any code changes.

![Gateway](./assets/overview.svg)

## Features

- **Single Line Setup**: Just change the base URL of your LLM to the Invariant Gateway.
- **Intercepts agents on an LLM-level** for better debugging and analysis.
- **Tool Calling and Computer Use Support** to capture all forms of agentic interactions.
- **Seamless forwarding and LLM streaming** to OpenAI, Anthropic, and others.
- **Stores and organize runtime traces** in the [Invariant Explorer](https://explorer.invariantlabs.ai/).

## Getting Started as a Security Admin

Looking to observe and secure AI agents in your organization? Read our no-code quickstart guides below, for configuring different agents directly with the Invariant Gateway.

This way, you can keep track of your organization's agents, without having to change their code.

If you are interested in deploying your own dedicated instance of the Invariant Gateway, see [self-hosting](./self-hosted.md).

<div class='tiles'>

<a href="agent-integrations/openhands" class='tile'>
    <span class='tile-title'>OpenHands Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenHands agents effortlessly using the Gateway.</span>
</a>

<a href="agent-integrations/swe-agent" class='tile'>
    <span class='tile-title'>SWE-agent Integration →</span>
    <span class='tile-description'>Streamline the development and debugging of SWE-agent applications with the Gateway.</span>
</a>

<a href="agent-integrations/browser-use" class='tile'>
    <span class='tile-title'>Browser Use Integration →</span>
    <span class='tile-description'>Optimize and troubleshoot your Browser Use applications with Invariant Gateway.</span>
</a>

</div>

## Getting Started as Developer

To quickly integrate your agentic application with the Gateway, it is enough to rely on our hosted instance which automatically traces your agent's LLM calls:

```python hl_lines="5 6 7 8 9 10 11 12"

from swarm import Swarm, Agent
from openai import OpenAI
from httpx import Client

# === Invariant integration ===
client = Swarm(
    client=OpenAI(
        # redirect and authenticate with the Invariant Gateway
        http_client=Client(headers={"Invariant-Authorization": "Bearer <your-token>"}),
        base_url="https://explorer.invariantlabs.ai/api/v1/gateway/<your-dataset-id>/openai",
    )
)

# === Agent Implementation ===

# define a tool
def get_weather():
    return "It's sunny."

# define an agent
agent = Agent(
    name="Agent A",
    instructions="You are a helpful agent.",
    functions=[get_weather],
)

# run the agent
response = client.run(
    agent=agent,
    messages=[{"role": "user", "content": "What's the weather?"}],
)

print(response.messages[-1]["content"])
# Output: "It seems to be sunny."
```

---

To learn how to use the Gateway with other LLM providers and agent frameworks, see the following sections:

<div class='tiles'>

<a href="llm-provider-integrations/openai" class='tile primary'>
    <span class='tile-title'>OpenAI Integration →</span>
    <span class='tile-description'>Seamlessly connect to OpenAI APIs through the Invariant Gateway.</span>
</a>

<a href="llm-provider-integrations/anthropic" class='tile primary'>
    <span class='tile-title'>Anthropic Integration →</span>
    <span class='tile-description'>Leverage the Invariant Gateway for smooth Anthropic API interactions.</span>
</a>

<a href="agent-integrations/openhands" class='tile'>
    <span class='tile-title'>OpenHands Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenHands agents effortlessly using the Gateway.</span>
</a>

<a href="agent-integrations/swe-agent" class='tile'>
    <span class='tile-title'>SWE-agent Integration →</span>
    <span class='tile-description'>Streamline the development and debugging of SWE-agent applications with the Gateway.</span>
</a>

<a href="agent-integrations/browser-use" class='tile'>
    <span class='tile-title'>Browser Use Integration →</span>
    <span class='tile-description'>Optimize and troubleshoot your Browser Use applications with Invariant Gateway.</span>
</a>

</div>

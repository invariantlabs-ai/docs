---
title: Welcome
---

# Invariant Agent Security and Debugging

<div class='subtitle'>A security and debugging layer for agentic AI systems.</div>

The Invariant eco-system offers a toolchain for building and securing agentic AI systems. It can be used both to build secure agentic AI systems _from scratch_, and to _secure existing or deployed AI agents_ in an organization.

For this, it relies on an entirely transparent proxy that intercepts and traces the LLM calls of your agent. This enables security guardrailing and insights during development and operation, without requiring any code changes to the actual agent system.

<div class='overview small'>
    <div class='clear box thirdparty'>
        Agent
    </div>
    <div class='box fill main clear'>
        <a class='box clear' href='./gateway'>
            <p>Invariant Gateway</p>
            <i>Transparent LLM proxy to trace and intercept LLM calls</i>
            <i class='more'>→</i>
        </a>
    </div>
    <div class='clear box thirdparty'>
        LLM Provider
    </div>
</div>

## Getting Started as Developer

To quickly integrate your agentic application with Invariant, it is enough to rely on our hosted gateway, to automatically trace your agent's LLM calls and to unlock the Invariant eco-system.

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

With this code, your agent is automatically tracked and all execution traces will be logged in a designated dataset in Explorer ([screenshot here](./explorer/)).

Overall, this integration opens up your agent system to the full Invariant family of tools, allowing you to [observe and debug](./explorer/), [write unit tests](testing/), and [analyze your agent's behavior for security vulnerabilities](https://github.com/invariantlabs-ai/invariant?tab=readme-ov-file#analyzer).

This documentation describes how to get started with Invariant eco-system and how to use the different tools, to build and secure your agentic AI systems.

## Getting Started as a Security Admin

Looking to observe and secure AI agents in your organization? Read our no-code quickstart guides below, for configuring different agents directly with the Invariant Gateway.

This way, you can keep track of your organization's agents, without having to change their code.

If you are interested in deploying your own dedicated instance of the Invariant Gateway, see [self-hosting](./gateway/self-hosted.md).

<div class='tiles'>

<a href="gateway/agent-integrations/openhands" class='tile'>
    <span class='tile-title'>OpenHands Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenHands agents effortlessly using the Gateway.</span>
</a>

<a href="gateway/agent-integrations/swe-agent" class='tile'>
    <span class='tile-title'>SWE-agent Integration →</span>
    <span class='tile-description'>Streamline the development and debugging of SWE-agent applications with the Gateway.</span>
</a>

<a href="gateway/agent-integrations/browser-use" class='tile'>
    <span class='tile-title'>Browser Use Integration →</span>
    <span class='tile-description'>Optimize and troubleshoot your Browser Use applications with Invariant Gateway.</span>
</a>

</div>

## Overview

With the gateway at the core, Invariant offers a family of tools for trace analysis and testing, allowing you to secure, debug and test your AI agents.

You can use each tool independently, or in combination with each other. The following interactive figure illustrates the Invariant eco-system and how the tools fit together. You can click on any of the boxes to learn more about the respective tool.

<div class='overview'>
    <div class='clear box thirdparty'>
        Agent
    </div>
    <div class='box fill main clear'>
        <a class='box clear' href='./gateway'>
            <p>Invariant Gateway</p>
            <i>Transparent LLM proxy to trace and intercept LLM calls</i>
            <i class='more'>→</i>
        </a>
        <!-- <div class='online'>
            <div class='title'>Online Guardrails</div>
            <div class='box fill clear' style="flex: 1;">
                <p>Analyzer</p>
                <i>Agent Security Scanner</i>
                <i class='more'>→</i>
            </div>
        </div> -->
    </div>
    <div class='clear box thirdparty'>
        LLM Provider
    </div>
</div>
<div class='overview'>
    <div class='clear box thirdparty hidden'>
        Agent
    </div>
    <div class='offline'>
        <div class='title'>Trace Analysis</div>
        <a class='box fill clear' href='./explorer'>
            <p>Explorer</p>
            <i>Trace viewing</i>
            <i class='more'>→</i>
        </a>
        <a class='box fill clear' href='./testing'>
            <p>Testing</p>
            <i>Agent Unit Testing</i>
            <i class='more'>→</i>
        </a>
        <a class='box fill clear' href='https://github.com/invariantlabs-ai/invariant?tab=readme-ov-file#analyzer'>
            <p>Analyzer</p>
            <i>Agent Security Scanner</i>
            <i class='more'>→</i>
        </a>
    </div>
    <div class='clear box thirdparty hidden'>
        LLM Provider
    </div>
</div>

You can click any of the boxes to learn more about the respective tool.

## Next Steps

<div class='tiles'>

<a href="gateway/" class='tile primary'>
    <span class='tile-title'>Gateway →</span>
    <span class='tile-description'>Setup the Invariant Gateway to trace and intercept LLM calls</span>
</a>

<a href="explorer/" class='tile primary'>
    <span class='tile-title'>Observe and Debug →</span>
    <span class='tile-description'>Use Invariant Explorer to inspect and debug your AI agent traces</span>
</a>

<a href="explorer/benchmarks" class='tile'>
    <span class='tile-title'>Benchmarks →</span>
    <span class='tile-description'>Submit your AI agent to the Invariant benchmark registry for comparison</span>
</a>

<a href="testing/" class='tile primary'>
    <span class='tile-title'>Testing →</span>
    <span class='tile-description'>Use Invariant <code>testing</code> to build debuggable unit tests for your AI agents</span>
</a>

<a href="explorer/api/trace-format" class='tile'>
    <span class='tile-title'>Trace Format →</span>
    <span class='tile-description'>Learn about the Invariant trace format and how to structure your traces for ingestion</span>
</a>

<a href="explorer/api/uploading-traces/push-api" class='tile'>
    <span class='tile-title'>Pushing Traces →</span>
    <span class='tile-description'>Learn about traces, datasets and annotations on Invariant.</span>
</a>

</div>

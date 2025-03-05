---
title: Welcome
---

# Invariant Agent Security and Debugging

<div class='subtitle'>A security and debugging layer for agentic AI systems.</div>

The Invariant eco-system offers a toolchain for building and securing agentic AI systems. It can be used both to build secure agentic AI systems _from scratch_, and to _secure existing or deployed AI agents_ in an organization.

For this, it relies on an entirely transparent proxy that intercepts and traces the LLM calls of your agent. This enables security guardrailing and insights during operation, without requiring any code changes to the agent.

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

With this code, your agent is automatically tracked and all execution traces will be logged in a designated dataset on the <img class='inline-invariant' src="assets/logo.svg"/> [Invariant Explorer](https://explorer.invariantlabs.ai).

Overall, this integration opens up your agent to the Invariant family of tools, allowing you to [observe and debug](./explorer/) your agent, [test it](testing/), and [analyze it for security vulnerabilities](https://github.com/invariantlabs-ai/invariant?tab=readme-ov-file#analyzer).

In the next sections, we will introduce the Invariant eco-system and how to get started with it.

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
